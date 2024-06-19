import { Alert, Image, StatusBar, View } from "react-native";

import { Input } from "@/components/input";

import { Button } from "@/components/button";

import { colors } from "@/styles/colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Link, Redirect } from "expo-router";
import { useState } from "react";

import { api } from "@/server/api";
import {useBagdeStore} from '@/store/badge-store'
import { checkIn } from "../../Server/src/routes/check-in";

export default function Home() {
  const [code, setCode] = useState("");
  const [isLoading, setisLoading] = useState(false)

  const bagdeStore = useBagdeStore()

  async function handleAccessCredential() {
    try{
    if (!code.trim()) {
      return Alert.alert("Ingresso", "Informe o código do ingresso!");
    }

    setisLoading(true)

    const {data} = await api.get(`/attendees/${code}/badge`)
    
    bagdeStore.save(data.badge)
    
    } catch(error){
      console.log(error)
      setisLoading(false)
      Alert.alert("Ingresso", "Ingresso não encotrado")
    }
  }

  if(bagdeStore.data?.checkInURL){
    return <Redirect href="/ticket"/>
  }


  return (
    <View className="flex-1 bg-green-500 items-center justify-center">
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="Código do ingresso"
            onChangeText={setCode}
          />
        </Input>
        <Button
          title="Acessar Credencial"
          onPress={() => handleAccessCredential()}
          isLoading={isLoading}
        />

        <Link
          href={"/register"}
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Ainda não possui ingresso?
        </Link>
      </View>
    </View>
  );
}
