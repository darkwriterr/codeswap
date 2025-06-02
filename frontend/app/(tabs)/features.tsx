import { View, Text } from "react-native";
import Header from "../../components/ui/Header";

export default function FeaturesScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Features Screen</Text>
            </View>
        </View>
    );
}
