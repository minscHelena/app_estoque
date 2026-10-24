import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Categoria, Produto } from '../types';
import { categoriaApi, produtoApi } from '../api/api';
import { BotaoSair } from '../components/BotaoSair';
import { ListaProduto } from '../components/ListaProdutos';
import { FormularioProtudo } from '../components/FormularioProduto';

export function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    try {
      setErro('');
      const [listaProdutos, listaCategorias] = await Promise.all([
        produtoApi.listar(),
        categoriaApi.listar(),
      ]);
      setProdutos(listaProdutos);
      setCategorias(listaCategorias);
    } catch {
      setErro('Não foi possível carregar os produtos e as categorias.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Produtos</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <ListaProduto produtos={produtos} carregando={carregando} />
      <FormularioProtudo categorias={categorias} onProdutoCriado={carregar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  erro: { color: '#dc2626', marginBottom: 10 },
});
