import { VStack, Icon, FlatList, useToast, Text } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PoolPros } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import api from "../services/api";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [pools, setPools] = useState<PoolPros[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toasts = useToast();

  const { navigate } = useNavigation();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);

      toasts.show({
        title: "Erro ao carregar as pools",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Meus bolões" />
      <VStack mt={6} mb={4} mx={5} pb={4} borderBottomWidth={1} borderColor="gray.600">
        <Button
          title="Buscar bolão por código"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PoolCard data={item} onPress={() => navigate("details", { id: item.id })} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyPoolList />}
          _contentContainerStyle={{ pb: 20 }}
          px={5}
          mb={5}
        />
      )}
    </VStack>
  );
}
