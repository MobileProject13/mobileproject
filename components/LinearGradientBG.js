import style from '../styles/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export const LinearGradientBG = () => {
  return (
    <>
    <LinearGradient
    colors={['#052939', '#1d4b5e']}
    start={{ x: 0.1, y: 1 }}
    end={{ x: 1, y: 0 }}
    locations={[0.2, 0.9]}
    style={style.gradientbackground}
    />
    </>
  )
}