import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import api from "../services/api";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(false);
  const [optionSelected, setOptionSelected] = useState<"Seus palpites" | "Ranking do grupo">("Seus palpites");
  const [pool, setPool] = useState<PoolPros>({} as PoolPros);
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      setPool(response.data.pool);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Erro ao carregar os detalhes da pool",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    Share.share({
      message: `Venha participar do meu bolão da copa: ${pool.title} - ${pool.code}`,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title={pool?.title} showBackButton showShareButton onShare={handleCodeShare} />

      {pool._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />

          <HStack bgColor="gray.800" p={1} rounded="sm">
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "Seus palpites"}
              onPress={() => setOptionSelected("Seus palpites")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "Ranking do grupo"}
              onPress={() => setOptionSelected("Ranking do grupo")}
            />
          </HStack>
          <Guesses poolId={id} code={pool.code} title={pool.title} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool.code} />
      )}
    </VStack>
  );
}
