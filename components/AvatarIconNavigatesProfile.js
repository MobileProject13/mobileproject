import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase/Config';
import { avatars } from './DataArrays';
import { Avatar } from 'react-native-paper';
import style from '../styles/Styles';
import { Pressable } from 'react-native';

//this is reusable component that 
//displays the user's avatar icon or selected image in the to right and 
//navigates to the profile screen when pressed

const AvatarIconNavigatesProfile = ({navigation}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const userIdforAvatar = auth.currentUser ? auth.currentUser.uid : null;

  useFocusEffect(
    React.useCallback(() => {
      getAvatarIndex();
    }, [])
  );

  const getAvatarIndex = async () => {
    try {
      const avatarIndex = await AsyncStorage.getItem('@avatar_index' + userIdforAvatar);
      if (avatarIndex !== null) {
        setSelectedAvatar(avatars[parseInt(avatarIndex, 10)]);
      }
    } catch (error) {
      console.log('Error getting avatar index:', error);
    }
  };

  return (
    <Pressable style={style.profileIconPosition} onPress={()=> navigation.navigate('Profile')}>
    {selectedAvatar === null ?
        <Avatar.Icon size={50} icon='account' />
    :    
        <Avatar.Image size={50} source={selectedAvatar} />
    }
    </Pressable>
  );
};

export default AvatarIconNavigatesProfile;