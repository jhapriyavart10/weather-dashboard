import { store } from '../redux/store';
import { updatePrice } from '../redux/slices/cryptoSlice';
import { addNotification } from '../redux/slices/notificationsSlice';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private pollingInterval: NodeJS.Timeout | null = null;
  private isWebSocketSupported: boolean;
  private isConnected: boolean = false;
  
  constructor() {
    // Check if WebSocket is supported in this environment
    this.isWebSocketSupported = typeof WebSocket !== 'undefined';
  }
  
  connect() {
    // Don't attempt to connect on server-side
    if (!this.isWebSocketSupported) {
      console.log('WebSocket not available - running in server or older browser');
      this.startPolling(); // Fall back to polling immediately
      return;
    }
    
    try {
      // Close existing connection if any
      this.disconnect();
      
      console.log('Attempting to connect to CoinCap WebSocket...');
      this.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        // Stop polling if it was running as fallback
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Process Bitcoin update
          if (data.bitcoin) {
            const price = parseFloat(data.bitcoin);
            store.dispatch(updatePrice({ id: 'bitcoin', price }));
          }
          
          // Process Ethereum update
          if (data.ethereum) {
            const price = parseFloat(data.ethereum);
            store.dispatch(updatePrice({ id: 'ethereum', price }));
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      
      this.socket.onerror = (error) => {
        // Only log the essential info to avoid circular JSON error
        console.error('WebSocket connection error - falling back to polling');
        this.isConnected = false;
        this.startPolling();
      };
      
      this.socket.onclose = (event) => {
        this.isConnected = false;
        console.log(`WebSocket connection closed: ${event.code}`);
        
        // Don't attempt to reconnect if we explicitly closed the connection
        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection - using polling fallback');
      this.startPolling();
    }
  }
  
  disconnect() {
    this.isConnected = false;
    
    if (this.socket) {
      try {
        this.socket.close(1000); // Normal closure
      } catch (e) {
        console.error('Error closing WebSocket:', e);
      }
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.reconnectTimer) {
      this.reconnectAttempts++;
      
      // Exponential backoff
      const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
      
      console.log(`Attempting to reconnect WebSocket in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum WebSocket reconnect attempts reached - falling back to polling');
      this.startPolling();
    }
  }
  
  private startPolling() {
    // Only start polling if not already polling
    if (this.pollingInterval) return;
    
    console.log('Starting price polling fallback mechanism');
    
    // Use the CoinGecko API for polling as fallback
    const pollPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        if (!response.ok) throw new Error('Failed to fetch prices');
        
        const data = await response.json();
        
        if (data.bitcoin?.usd) {
          store.dispatch(updatePrice({ id: 'bitcoin', price: data.bitcoin.usd }));
        }
        
        if (data.ethereum?.usd) {
          store.dispatch(updatePrice({ id: 'ethereum', price: data.ethereum.usd }));
        }
      } catch (error) {
        console.error('Error polling prices:', error);
      }
    };
    
    // Initial poll
    pollPrices();
    
    // Set up interval - poll every 30 seconds
    this.pollingInterval = setInterval(pollPrices, 30000);
  }
  
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isUsingWebSocket: this.isConnected && this.socket !== null,
      isPolling: this.pollingInterval !== null,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create a singleton instance
const websocketService = (typeof window !== 'undefined') 
  ? new WebSocketService()
  : {
      connect: () => {},
      disconnect: () => {},
      getConnectionStatus: () => ({ isConnected: false, isUsingWebSocket: false, isPolling: false, reconnectAttempts: 0 })
    } as WebSocketService;

export { websocketService };