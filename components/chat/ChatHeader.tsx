import React, { useState } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { ArrowLeft, MoreVertical, MessageCirclePlus } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import ResponsiveImage from '@/components/customUtils/responsiveImage';

const faceIcon = require('@/assets/icons/chat-face.png');
const secondaryColor = "#FFC132";

interface ChatHeaderProps {
  aiName: string;
  chatType: 'roleplay' | 'main';
  isScreenActive: React.MutableRefObject<boolean | null>;
  onNewChat?: () => void;
  onInfoPress?: () => void;
  stopRecording: () => Promise<void>; 
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ aiName, chatType, isScreenActive, onNewChat, onInfoPress, stopRecording }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewSession = () => {
    setModalVisible(false);
    onNewChat && onNewChat();
  };

  const handleBackPress = async () => {
    await stopRecording(); 
    isScreenActive.current = false;
    navigation.goBack();
  };

  return (
    <>
      <ResponsiveView 
        className="flex-row items-center justify-between border-b border-gray-200"
        responsiveStyle={{
          sm: { paddingHorizontal: 16, paddingBottom: 4, marginBottom: 8 },
          md: { paddingHorizontal: 16, paddingBottom: 4, marginBottom: 8, marginTop:0 },
          lg: { paddingHorizontal: 28, paddingBottom: 8, marginBottom: 12, marginTop:24 },
        }}
      >
        <ResponsiveView className="flex-row items-center">
          <TouchableOpacity onPress={handleBackPress}>
            <ResponsiveIcon
              icon={{ type: 'lucide', icon: ArrowLeft }}
              responsiveSize={{
                sm: 24,
                md: 24,
                lg: 40,
              }}
              color="#000"
            />
          </TouchableOpacity>
          <ResponsiveImage
            source={faceIcon}
            responsiveStyle={{
              sm: { width: 40, height: 40, marginLeft: 8, marginRight: -10 },
              md: { width: 40, height: 40, marginLeft: 8, marginRight: -10 },
              lg: { width: 72, height: 72, marginLeft: 18, marginRight: -10 },
            }}
          />
          <ResponsiveView 
            className="absolute bg-green-500 rounded-full"
            responsiveStyle={{
              sm: { left: 64, bottom: 0, width: 12, height: 12 },
              md: { left: 64, bottom: 0, width: 12, height: 12 },
              lg: { left: 112, bottom: 0, width: 20, height: 20 },
            }}
          />
          <ResponsiveText 
            className="font-NunitoSemiBold"
            responsiveStyle={{
              sm: { fontSize: 18, marginLeft: 16 },
              md: { fontSize: 18, marginLeft: 16 },
              lg: { fontSize: 36, marginLeft: 32 },
            }}
          >
            {aiName.charAt(0).toUpperCase() + aiName.slice(1)}
          </ResponsiveText>
        </ResponsiveView>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <ResponsiveIcon
            icon={{ type: 'lucide', icon: MoreVertical }}
            responsiveSize={{
              sm: 24,
              md: 24,
              lg: 40,
            }}
            color="#000"
          />
        </TouchableOpacity>
      </ResponsiveView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-opacity-50"
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <ResponsiveView 
            className="absolute bottom-0 left-0 right-0 bg-slate-400 justify-center"
            responsiveStyle={{
              sm: { height: 176 },
              md: { height: 176 },
              lg: { height: 280 },
            }}
          >
            <ResponsiveView 
              className="bg-white rounded-full self-center "
              responsiveStyle={{
                sm: { marginTop: -30 },
                md: { marginTop: -30, width: 160, height: 4, marginBottom:16  },
                lg: { marginTop: -40, width: 420, height: 8, marginBottom:32},
              }}
            />
            <ResponsiveView className="mx-4 bg-white rounded-3xl pb-5">
              <TouchableOpacity
                onPress={handleNewSession}
                className="flex-row items-center mx-6 mt-6 mb-2"
              >
                <ResponsiveView 
                  className="bg-primary-500 rounded-full mr-4"
                  responsiveStyle={{
                    sm: { padding: 8 },
                    md: { padding: 8 },
                    lg: { padding: 16 },
                  }}
                >
                  <ResponsiveIcon
                    icon={{ type: 'lucide', icon: MessageCirclePlus }}
                    responsiveSize={{
                      sm: 30,
                      md: 30,
                      lg: 46,
                    }}
                    color="white"
                  />
                </ResponsiveView>
                <View>
                  <ResponsiveText 
                    className="text-black font-NunitoSemiBold"
                    responsiveStyle={{
                      sm: { fontSize: 16 },
                      md: { fontSize: 16 },
                      lg: { fontSize: 32 },
                    }}
                  >
                    Start a new chat
                  </ResponsiveText>
                  <ResponsiveText 
                    className="text-gray-500"
                    responsiveStyle={{
                      sm: { fontSize: 14 },
                      md: { fontSize: 14 },
                      lg: { fontSize: 28 },
                    }}
                  >
                    End the current chat and start a new one.
                  </ResponsiveText>
                </View>
              </TouchableOpacity>
            </ResponsiveView>
          </ResponsiveView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ChatHeader;