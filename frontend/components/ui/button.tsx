import { useAppTheme } from "@/hooks/use-app-theme";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

type buttonProps = {
    onPress: () => void,
    width: number,
    fontSize: number,
    marginTop: number,
    text: string,
    marginBottom?: number,
    height?: number,
    isDisabled?: boolean,
    isLoading?: boolean,
}

export default function Button(props: buttonProps) {
    const theme = useAppTheme();
    const styles = createStyles(theme);

    return(
        <View style={[styles.registerContainer, {marginTop: props.marginTop, marginBottom: props.marginBottom ?? 0} ]}>

            <TouchableOpacity style={[styles.button, {width: props.width, height: props.height ?? "auto", 
                opacity: props.isDisabled? 0.4 : 1}]} onPress={props.onPress} disabled={props.isDisabled ?? false}>
                {props.isLoading ? (
                    <ActivityIndicator color={theme.text} />
                ) :
                (
                    <Text style={[styles.buttonText, {fontSize: props.fontSize}]}>{props.text}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

export const createStyles = (theme: any) => {
    const styles = StyleSheet.create({
        button: {
            marginTop: 20,
            borderWidth: 2,
            borderColor: theme.text,
            borderRadius: 50,
            paddingVertical: 10,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.text,
            fontWeight: '500',
            fontFamily: "Nunito_700Bold",
        },
        registerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
        }
    });
    return styles;
}