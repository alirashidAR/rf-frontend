// src/services/chatService.js
import axios from 'axios';

const API_URL = "https://rf-backend-alpha.vercel.app" || 'http://localhost:5000/api';

const chatService = {
  // Initialize chat room for a project
  initializeChatRoom: async (projectId, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/project/${projectId}/chat`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get chat room for a project with pagination
  getChatRoom: async (projectId, token, page = 1, limit = 50) => {
    try {
      const response = await axios.get(
        `${API_URL}/project/${projectId}/chat?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send a message to a chat room
  sendMessage: async (projectId, messageData, token) => {
    try {
      // Handle file attachments with FormData
      const formData = new FormData();
      
      if (messageData.content) {
        formData.append('content', messageData.content);
      }
      
      if (messageData.attachments && messageData.attachments.length > 0) {
        for (const file of messageData.attachments) {
          formData.append('attachments', file);
        }
      }

      const response = await axios.post(
        `${API_URL}/project/${projectId}/chat/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark messages as read in a chat room
  markMessagesAsRead: async (projectId, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/project/${projectId}/chat/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread message count for current user
  getUnreadMessageCount: async (token) => {
    try {
      const response = await axios.get(
        `${API_URL}/chat/unread`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default chatService;