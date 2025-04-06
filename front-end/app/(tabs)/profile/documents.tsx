import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';
import supabase from '@/api/supabaseClient';

export default function DocumentsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null); // ✅ NEW

  const fetchDocuments = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      Alert.alert('Delete Failed', error.message);
    } else {
      fetchDocuments();
    }
  };

  const openRenameModal = (doc: any) => {
    setSelectedDoc(doc);
    setNewFileName(doc.file_name);
    setRenameModalVisible(true);
  };

  const handleRename = async () => {
    if (!selectedDoc) return;
    const { error } = await supabase
      .from('documents')
      .update({ file_name: newFileName })
      .eq('id', selectedDoc.id);

    if (error) {
      Alert.alert('Rename Failed', error.message);
    } else {
      fetchDocuments();
      setRenameModalVisible(false);
    }
  };

  return (
    <View className="flex-1 bg-[#e3fcef] px-4 pt-16">
      <Text className="text-2xl font-bold mb-4">My Documents</Text>

      <ScrollView className="mb-4">
        {documents.map((doc) => (
          <View
            key={doc.id}
            className="mb-3 bg-white p-4 rounded-lg shadow-md"
          >
            <Text className="text-lg font-semibold mb-2">{doc.file_name}</Text>

            {doc.image_base64 && (
              <TouchableOpacity onPress={() => setFullScreenImage(doc.image_base64)}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${doc.image_base64}` }}
                  style={{ width: '100%', height: 200, borderRadius: 8 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            <View className="flex-row mt-3 justify-between">
              <TouchableOpacity
                className="bg-yellow-400 px-3 py-2 rounded"
                onPress={() => openRenameModal(doc)}
              >
                <Text>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-3 py-2 rounded"
                onPress={() =>
                  Alert.alert(
                    'Delete Document',
                    'Are you sure you want to delete this document?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        onPress: () => handleDelete(doc.id),
                        style: 'destructive',
                      },
                    ]
                  )
                }
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="mt-6 bg-green-600 py-3 px-6 rounded-full self-center mb-12"
          onPress={() => router.push('/(tabs)/profile/DocumentCameraScreen')}
        >
          <Text className="text-white font-semibold text-lg">Add Document</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Rename Modal */}
      <Modal visible={renameModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white w-full rounded-lg p-6">
            <Text className="text-lg font-semibold mb-2">Rename Document</Text>
            <TextInput
              className="border border-gray-300 rounded px-3 py-2 mb-4"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRename}>
                <Text className="text-green-600 font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Image Viewer */}
      <Modal visible={!!fullScreenImage} transparent animationType="fade">
        <Pressable
          onPress={() => setFullScreenImage(null)}
          className="flex-1 bg-black/90 justify-center items-center"
        >
          {fullScreenImage && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${fullScreenImage}` }}
              style={{ width: '90%', height: '80%' }}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
