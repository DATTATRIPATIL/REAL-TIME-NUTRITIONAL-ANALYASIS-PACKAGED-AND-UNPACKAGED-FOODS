import { Pressable, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";

export function HapticTab(props: PressableProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPressIn?.(event);
      }}
    />
  );
}
