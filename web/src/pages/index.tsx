import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import iconCheckImg from "../assets/icon-check.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";
import Head from "next/head";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post("/pools", { title: poolTitle });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      setPoolTitle("");
      alert(`Sua copa foi criada com sucesso! O código dela é: ${code} e já foi copiado para a área de transferência!`);
    } catch (error) {
      alert("Erro ao criar pool");
    }
  }

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <title>Copa | Crie seu bolão e compartilhe!</title>
      </Head>
      <div className="max-w-6xl h-screen mx-auto grid grid-cols-1 lg:grid-cols-2 gap-28 items-center p-8">
        <main>
          <Image src={logoImg} alt="NLW Copa" />

          <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
            Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>

          <div className="mt-10 flex items-center gap-2">
            <Image src={usersAvatarExampleImg} alt="App Preview" />

            <strong className="text-gray-100 text-xl">
              <span className="text-ignite-500">+{props.usersCount}</span>{" "}
              {props.usersCount > 1 ? "pessoas já estão usando" : "pessoa já está usando"}
            </strong>
          </div>

          <form className="mt-10 flex gap-2" onSubmit={createPool}>
            <input
              type="text"
              required
              placeholder="Qual o nome do seu bolão?"
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100"
              onChange={(event) => setPoolTitle(event.target.value)}
              value={poolTitle}
            />

            <button
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 transition-all duration-300"
              type="submit"
            >
              Criar meu bolão
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="Icon Check" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.poolCount}</span>
                <span>{props.poolCount > 1 ? "Bolões criados" : "Bolão criado"}</span>
              </div>
            </div>

            <div className="w-px h-14 bg-gray-600" />

            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="Icon Check" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{props.guessCount}</span>
                <span>{props.guessCount > 1 ? "Palpites enviados" : "Palpite enviado"}</span>
              </div>
            </div>
          </div>
        </main>
        <div>
          <Image src={appPreviewImage} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get("/pools/count"),
    api.get("/guesses/count"),
    api.get("/users/count"),
  ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: userCountResponse.data.count,
    },
  };
};
