

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import Header from '../../common/Header';
import Colors from '../../../utils/Colors';

// Animated typing dot component
const TypingDot = ({ delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [delay, opacity]);

  return (
    <Animated.View
      style={[
        {
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: '#6B7280',
          marginHorizontal: 2,
        },
        { opacity },
      ]}
    />
  );
};

const HelpCenter = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    pairTally: false,
    purchaseCredits: false,
    changeGSTIN: true,
  });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const chatScrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Quick suggestions for users
  const quickSuggestions = [
    'How do I pair with Tally?',
    'Purchase credits',
    'Change GSTIN',
    'Export reports',
  ];

  const toggleSection = sectionId => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSendMessage = (messageText = null) => {
    const textToSend = messageText || chatInput.trim();
    const hasAttachments = attachedFiles.length > 0;
    
    if (textToSend || hasAttachments) {
      const userMessage = {
        id: Date.now(),
        text: textToSend || '',
        type: 'user',
        timestamp: new Date(),
        attachments: attachedFiles.length > 0 ? [...attachedFiles] : [],
      };
      
      setMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setAttachedFiles([]); // Clear attachments after sending
      Keyboard.dismiss(); // Dismiss keyboard when sending
      setIsTyping(true);
      
      // Simulate bot reply with typing indicator
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: getBotResponse(textToSend || 'file'),
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('pair') || lowerMessage.includes('tally')) {
      return 'To pair with Tally:\n\n1. Ensure both devices are on the same network\n2. Open Tally on your desktop\n3. Go to Settings > Tally Sync in the app\n4. Follow the pairing instructions\n\nNeed more help?';
    } else if (lowerMessage.includes('credit') || lowerMessage.includes('purchase')) {
      return 'You can purchase credits through:\n\n• Settings > License section\n• Choose from various packages\n• Secure payment gateway\n\nWould you like to know about pricing?';
    } else if (lowerMessage.includes('gstin') || lowerMessage.includes('gst')) {
      return 'To update your GSTIN:\n\n1. Go to Settings > Tax Information\n2. Click Edit GSTIN\n3. Enter new GSTIN\n4. Upload required documents\n\nChanges reflect after verification.';
    } else {
      return 'Thank you for your message! I\'m here to help you with TallyDekho.\n\nI can assist you with:\n• Tally pairing\n• Credit purchases\n• GSTIN changes\n• Report exports\n\nWhat would you like to know more about?';
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleAttachFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed', // Allows both images and videos
        includeBase64: false,
        quality: 0.8,
        selectionLimit: 5, // Allow multiple file selection
      });

      if (result?.assets && result.assets.length > 0) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `file_${Date.now()}.${asset.type?.split('/')[1] || 'jpg'}`,
          size: asset.fileSize || 0,
        }));
        setAttachedFiles(prev => [...prev, ...newFiles]);
      } else if (result.didCancel) {
        // User cancelled, do nothing
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && chatScrollViewRef.current) {
      setTimeout(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Scroll when typing indicator appears
  useEffect(() => {
    if (isTyping && chatScrollViewRef.current) {
      setTimeout(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isTyping]);

  const renderFAQSection = (id, title, content) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => toggleSection(id)}>
        <Text style={styles.faqTitle}>{title}</Text>
        <Ionicons
          name={expandedSections[id] ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {expandedSections[id] && (
        <View style={styles.faqContent}>
          <Text style={styles.faqText}>{content}</Text>
        </View>
      )}
    </View>
  );

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <>
      <Header
        title="Help Center"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* Chat Container */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
          <View style={styles.chatContainer}>
            {/* Header Banner */}
            <View style={styles.chatHeader}>
              <View style={styles.botAvatarLarge}>
                <Ionicons name="sparkles" size={24} color="#10B981" />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderTitle}>Tally Dekho Assistant</Text>
                <Text style={styles.chatHeaderSubtitle}>
                  Always here to help • Instant responses
                </Text>
              </View>
            </View>

            {/* Chat Messages Area - Scrollable */}
            <View style={styles.chatMessagesContainer}>
              <ScrollView
                ref={chatScrollViewRef}
                style={styles.chatMessagesScroll}
                contentContainerStyle={styles.chatMessagesContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                nestedScrollEnabled={true}>

                {/* Empty state */}
                {messages.length === 0 && (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyStateIcon}>
                      <Ionicons name="chatbubbles-outline" size={48} color="#10B981" />
                    </View>
                    <Text style={styles.emptyStateTitle}>Start a conversation</Text>
                    <Text style={styles.emptyStateDescription}>
                      Ask me anything about TallyDekho. I'm here to help!
                    </Text>

                    {/* Quick suggestions */}
                    {/* <View style={styles.quickSuggestionsContainer}>
                      {quickSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.quickSuggestionChip}
                          onPress={() => handleQuickSuggestion(suggestion)}>
                          <Ionicons name="bulb-outline" size={14} color="#10B981" />
                          <Text style={styles.quickSuggestionText}>{suggestion}</Text>
                        </TouchableOpacity>
                      ))}
                    </View> */}
                  </View>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.type === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                    ]}>
                    {/* Bot avatar */}
                    {message.type === 'bot' && (
                      <View style={styles.botAvatar}>
                        <Ionicons name="sparkles" size={16} color="#10B981" />
                      </View>
                    )}

                    <View style={styles.messageContent}>
                      <View
                        style={[
                          styles.messageBubble,
                          message.type === 'user' ? styles.userBubble : styles.botBubble,
                        ]}>
                        {message.text ? (
                          <Text
                            style={[
                              styles.messageText,
                              message.type === 'user' ? styles.userMessageText : styles.botMessageText,
                            ]}>
                            {message.text}
                          </Text>
                        ) : null}
                        {message.attachments && message.attachments.length > 0 && (
                          <View style={[styles.messageAttachments, !message.text && {marginTop: 0}]}>
                            {message.attachments.map((file, index) => (
                              <View key={index} style={styles.messageAttachmentItem}>
                                <Ionicons name="document" size={16} color={message.type === 'user' ? '#FFFFFF' : '#10B981'} />
                                <Text
                                  style={[
                                    styles.messageAttachmentText,
                                    message.type === 'user' ? styles.userMessageText : styles.botMessageText,
                                  ]}
                                  numberOfLines={1}>
                                  {file.name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                      <Text style={styles.messageTime}>
                        {formatTime(message.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <View style={[styles.messageContainer, styles.botMessageContainer]}>
                    <View style={styles.botAvatar}>
                      <Ionicons name="sparkles" size={16} color="#10B981" />
                    </View>
                    <View style={styles.messageContent}>
                      <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                        <View style={styles.typingIndicator}>
                          <TypingDot delay={0} />
                          <TypingDot delay={200} />
                          <TypingDot delay={400} />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Input Area - Fixed at Bottom */}
            <View style={styles.chatInputWrapper}>
              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <View style={styles.attachedFilesContainer}>
                  {attachedFiles.map((file, index) => (
                    <View key={index} style={styles.attachedFileChip}>
                      <Ionicons 
                        name="document" 
                        size={16} 
                        color="#10B981" 
                        style={styles.attachedFileIcon}
                      />
                      <Text style={styles.attachedFileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeAttachedFile(index)}
                        style={styles.removeFileButton}>
                        <Ionicons name="close-circle" size={18} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.chatInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.chatInput}
                  placeholder="Message Tally Dekho Assistant..."
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={500}
                />

                <TouchableOpacity 
                  style={styles.attachButton}
                  onPress={handleAttachFile}>
                  <Ionicons name="attach-outline" size={22} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSendMessage()}
                  disabled={!chatInput.trim() && attachedFiles.length === 0}>
                  <Ionicons
                    name="send"
                    size={18}
                    color={(chatInput.trim() || attachedFiles.length > 0) ? '#10B981' : '#6B7280'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* FAQ Section */}
        {/* <View style={styles.faqSectionWrapper}>
          <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
          {renderFAQSection(
            'pairTally',
            'How do I pair with Tally?',
            'To pair with Tally, ensure both devices are on the same network. Go to Settings > Tally Sync and follow the pairing instructions.',
          )}

          {renderFAQSection(
            'purchaseCredits',
            'Purchase credits?',
            'You can purchase credits through the License section in Settings. Choose from various credit packages based on your needs.',
          )}

          {renderFAQSection(
            'changeGSTIN',
            'How to change GSTIN?',
            'To update your GSTIN, go to Settings > Tax Information, then click Edit GSTIN. Enter your new GSTIN and upload the required proof. Changes will reflect after verification.',
          )}
        </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    minHeight: 500,
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    flexDirection: 'column',
  },

  // Header styles
  chatHeader: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#fff',
  },
  botAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Messages container
  chatMessagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatMessagesScroll: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 20,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Quick suggestions
  quickSuggestionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  quickSuggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickSuggestionText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Message styles
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 16,
  },
  messageContent: {
    maxWidth: '75%',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    marginLeft: 4,
  },
  messageAttachments: {
    marginTop: 8,
  },
  messageAttachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 4,
  },
  messageAttachmentText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  
  // Typing indicator
  typingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },

  // Input area - Fixed at bottom
  chatInputWrapper: {
    flexShrink: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    marginBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  attachedFilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  attachedFileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    maxWidth: '45%',
  },
  attachedFileIcon: {
    marginRight: 6,
  },
  attachedFileName: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  removeFileButton: {
    marginLeft: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginBottom: 6,
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 150,
    fontSize: 14,
    color: '#111827',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 12,
    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
    textAlignVertical: 'top',
    lineHeight: 20,
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginBottom: 6,
  },

  // FAQ section
  faqSectionWrapper: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  faqText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
  },
});

export default HelpCenter;

