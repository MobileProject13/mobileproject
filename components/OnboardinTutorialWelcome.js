import Onboarding from 'react-native-onboarding-swiper';
import React, { useEffect, useRef} from 'react';
import { View, Animated, Image } from 'react-native';
import { Text } from 'react-native-paper';

export const OnboardTutorialWelcome = ({navigation}) => {

    const Skip = ({...props}) => (
        <Text style={{color: 'white', fontSize: 20, marginLeft: 15}} {...props}>SKIP</Text>
      );
    
      const Next = ({...props}) => (
        <Text style={{color: 'white', fontSize: 20, marginRight: 15}} {...props}>NEXT</Text>
      );
    
      const Done = ({...props}) => (
        <Text style={{color: 'white', fontSize: 20, marginRight: 15}} {...props}>DONE</Text>
      );

    return (
      <View style={{flex:1}}>
        <Onboarding
        containerStyles={{paddingHorizontal: 15}}
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        onSkip={() => navigation.replace('Welcome')}
        onDone={() => navigation.navigate('Welcome')}
          pages={[
            {
              backgroundColor: '#052939',
              image: <FadeInImage imageSource={require('../assets/onboarding/onboarding01.png')}/>,
              title: 'Welcome to TOBU!',
              subtitle: 'With Tobu you can keep track of \n your daily tasks, budget and calendar.',
            },
            {
              backgroundColor: '#052939',
              image: <View>
                <Text style={{textAlign: 'center', marginBottom: 30, fontSize: 30}}>Task management</Text>
                <Image  style= {{width: 300, height: 300}} source={require('../assets/onboarding/todos01.png')}/>
                </View>,
              title: 'Easy way to manage tasks',
              subtitle: 'Create, edit and delete tasks. \n Customize your tasks with different colors',
            },
            {
              backgroundColor: '#052939',
              image: <View>
                <Text style={{textAlign: 'center', marginBottom: 30, fontSize: 30}}>Budget management</Text>
                <Image  style= {{width: 300, height: 300}} source={require('../assets/onboarding/budget01.png')}/>
                </View>,
              title: 'Track your budget',
              subtitle: 'Keep track of your expenses and income. \n Set a budget and track your spending.',
            },
            {
              backgroundColor: '#052939',
              image: <View>
                <Text style={{textAlign: 'center', marginBottom: 30, fontSize: 30}}>Calendar view</Text>
                <Image  style= {{width: 300, height: 300}} source={require('../assets/onboarding/calendar01.png')}/>
                </View>,
              title: 'Check your calendar',
              subtitle: 'View your tasks and budget in a calendar view. \n Plan your day, week or month.',
            },
            {
                backgroundColor: '#052939',
                image: <View style={{padding: 15}}>
                  <Text style={{textAlign: 'center', marginBottom: 30, fontSize: 30}}>Wondering how to start?</Text>
                  <Image source={require('../assets/onboarding/loginregister01.gif')}/>
                  </View>,
                title: 'Start with Signing in.',
                subtitle: 'Sign in to Tobu to start using the app. \n If you are new, you can register an account.',
              },
              {
                backgroundColor: '#052939',
                image: <View style={{padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{textAlign: 'center', marginBottom: 30, fontSize: 30}}>Start you TOBU journey!</Text>
                  <Image source={require('../assets/onboarding/confetti.gif')}/>
                  </View>,
                title: 'Tobu makes all better!',
                subtitle: 'Choose Tobu and make your life easier.',
              },
          ]}
        />
      </View>
      );
    };

     export const FadeInImage = ({imageSource}) => {
      const opacity = useRef(new Animated.Value(0)).current;
    
      useEffect(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }, []);
    
      return (
        <Animated.Image
          source={imageSource}
          style={{ opacity }}
        />
      );
    };