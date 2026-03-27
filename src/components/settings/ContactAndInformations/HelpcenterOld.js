import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import Header from '../../common/Header';
import Colors from '../../../utils/Colors';
import { Icons } from '../../../utils/Icons';

const HelpCenterOld = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    pairTally: false,
    purchaseCredits: false,
    changeGSTIN: true,
  });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const chatScrollViewRef = useRef(null);

  const handleAttachFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (result?.assets && result.assets.length > 0) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
        }));
        setAttachedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    }
  };

  const removeAttachedFile = index => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSection = sectionId => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSendMessage = () => {
    if (chatInput.trim() || attachedFiles.length > 0) {
      const userMessage = {
        id: Date.now(),
        text: chatInput.trim(),
        type: 'user',
        timestamp: new Date(),
        attachments: attachedFiles.length > 0 ? [...attachedFiles] : [],
      };

      setMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setAttachedFiles([]);

      // Simulate bot reply (you'll replace this with actual chatbot integration later)
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: 'Thank you for your message. I\'m here to help you with TallyDekho. How can I assist you today?',
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && chatScrollViewRef.current) {
      setTimeout(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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

  return (
    <>
      <Header
        title="Help Center"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* AI Chatbot Section */}
          <View style={styles.chatbotSection}>
            <View style={styles.tallyDekhoBanner}>
              <View style={styles.bannerHeader}>
                <View style={styles.tallyIcon}>
                  <Ionicons name="sparkles" size={20} color="#10B981" />
                </View>
                <Text style={styles.tallyDekhoText}>Tally Dekho</Text>
              </View>
              <Text style={styles.bannerDescription}>
                Ask me anything about TallyDekho in your own language.
              </Text>
            </View>

            {/* Chat Messages Area */}
            {messages.length > 0 && (
              <View style={styles.chatMessagesContainer}>
                <ScrollView
                  ref={chatScrollViewRef}
                  style={styles.chatMessagesScroll}
                  contentContainerStyle={styles.chatMessagesContent}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}>
                  {messages.map((message) => (
                    <View
                      key={message.id}
                      style={[
                        styles.messageContainer,
                        message.type === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                      ]}>
                      <View
                        style={[
                          styles.messageBubble,
                          message.type === 'user' ? styles.userBubble : styles.botBubble,
                        ]}>
                        {message.attachments?.length > 0 && (
                          <View style={styles.messageImages}>
                            {message.attachments.map((file, i) => (
                              <Image
                                key={i}
                                source={{uri: file.uri}}
                                style={styles.messageImage}
                                resizeMode="cover"
                              />
                            ))}
                          </View>
                        )}
                        {message.text ? (
                          <Text
                            style={[
                              styles.messageText,
                              message.type === 'user' ? styles.userMessageText : styles.botMessageText,
                            ]}>
                            {message.text}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask anything"
                value={chatInput}
                onChangeText={setChatInput}
                placeholderTextColor={'#8F939E'}
                multiline
              />

              {attachedFiles.length > 0 && (
                <View style={styles.attachedFilesContainer}>
                  {attachedFiles.map((file, index) => (
                    <View key={index} style={styles.attachedFileChip}>
                      <Image source={{uri: file.uri}} style={styles.attachedThumb} />
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

              <View style={styles.bottomRow}>
                <View style={styles.iconOptions}>
                  <TouchableOpacity style={styles.iconOption} onPress={handleAttachFile}>
                    <Icons.Upload />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}>
                  <Icons.Send />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.faqSection}>
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
            </View>
          </View>

          {/* FAQ Section */}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  chatbotSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tallyDekhoBanner: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    // Adding subtle gradient effect with shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  tallyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tallyDekhoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.95,
  },
  chatInputContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  chatInput: {
    minHeight: 140,
    maxHeight: 200,
    fontSize: 14,
    color: '#111827',
    padding: 16,
    paddingBottom: 8,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  faqSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 10,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 15,
    backgroundColor: '#fff',
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  faqContent: {
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  faqText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fff',
  },
  iconOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconOption: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chatMessagesContainer: {
    maxHeight: 400,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  chatMessagesScroll: {
    flexGrow: 0,
  },
  chatMessagesContent: {
    padding: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    // backgroundColor: '#07624C',
    borderBottomRightRadius: 4,
    backgroundColor:'#fff'
  },
  botBubble: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
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
  attachedFilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  attachedFileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    maxWidth: '70%',
  },
  attachedThumb: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginRight: 6,
  },
  attachedFileName: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
  },
  removeFileButton: {
    marginLeft: 6,
  },
  messageImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  messageImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default HelpCenterOld;