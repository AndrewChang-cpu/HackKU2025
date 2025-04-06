import React, { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import { View, Text, TextField, Button, ListItem, Checkbox, Colors } from 'react-native-ui-lib';


interface Item {
  value: string | number;
  label: string;
}

interface MultiSelectPickerProps {
  items: Item[];
  onSelect: (selected: (string | number)[]) => void;
}

export default function MultiSelectPicker({ items, onSelect }: MultiSelectPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (item: Item) => {
    if (selectedItems.includes(item.value)) {
      setSelectedItems(selectedItems.filter(val => val !== item.value));
    } else {
      setSelectedItems([...selectedItems, item.value]);
    }
  };

  return (
    <View>
      <Button label="Select Items" onPress={() => setVisible(true)} />

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View padding-16 flex>
          <TextField 
            placeholder="Search..." 
            onChangeText={setSearch} 
            value={search} 
            marginB-16
          />

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <ListItem onPress={() => toggleSelect(item)} containerStyle={{ paddingVertical: 8 }}>
                <ListItem.Part marginR-8>
                  <Checkbox
                    value={selectedItems.includes(item.value)}
                    onValueChange={() => toggleSelect(item)}
                    color={Colors.primary}
                  />
                </ListItem.Part>
                <ListItem.Part>
                  <Text text80>{item.label}</Text>
                </ListItem.Part>
              </ListItem>
            )}
          />

          <Button 
            label="Done" 
            marginT-16
            onPress={() => {
              onSelect(selectedItems);
              setVisible(false);
            }} 
          />
        </View>
      </Modal>
    </View>
  );
}
