import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type buttonProps = {
    onPress: () => void,
    width: number,
    fontSize: number,
    marginTop: number,
    text: string,
    marginBottom?: number,
    height?: number,
    isDisabled?: boolean
}

export default function Button(props: buttonProps) {
    return(
        <View style={[styles.registerContainer, {marginTop: props.marginTop, marginBottom: props.marginBottom ?? 0} ]}>

            <TouchableOpacity style={[styles.button, {width: props.width, height: props.height ?? "auto", 
                opacity: props.isDisabled? 0.4 : 1}]} onPress={props.onPress} disabled={props.isDisabled ?? false}>

                <Text style={[styles.buttonText, {fontSize: props.fontSize}]}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#388087',
        borderRadius: 50,
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#388087',
        fontWeight: '500',
        fontFamily: "Nunito_700Bold",
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
})