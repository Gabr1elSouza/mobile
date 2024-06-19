import { FontAwesome } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/components/button";
import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import { colors } from "@/styles/colors";

import { QrCode } from "@/components/qrcode";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { MotiView } from "moti";

import { useBagdeStore } from "@/store/badge-store";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false);

  const BagdeStore = useBagdeStore();

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });

      if (result.assets) {
        BagdeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Foto", "Não foi possivel selecionar a imagem.");
    }
  }

  if (!BagdeStore.data?.checkInURL) {
    return <Redirect href="/" />;
  }

  async function handleShare() {
    try {
      if (BagdeStore.data?.checkInURL) {
        await Share.share({ message: BagdeStore.data.checkInURL });
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Compartilhar", "Nã");
    }
  }

  return (
    <View className="flex-1 bg bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-9 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          onChangeAvatar={handleSelectImage}
          onExpandQRCode={() => setExpandQRCode(true)}
          data={BagdeStore.data}
        />
        <MotiView
          from={{ translateY: 0 }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: "timing",
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar Credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do evento{" "}
          {BagdeStore.data.eventTitle}!
        </Text>

        <Button title="Compartilhar" onPress={handleShare} />
        <TouchableOpacity
          activeOpacity={0.7}
          className="m-10"
          onPress={() => BagdeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <QrCode value={`${BagdeStore.data.checkInURL}`} size={300} />
            <Text className="font-bold text-orange-500 text-sm mt-10 text-center">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
