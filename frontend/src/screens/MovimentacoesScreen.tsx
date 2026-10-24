import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Movimentacao, Produto } from '../types';
import { movimentacaoApi, produtoApi } from '../api/api';
import { BotaoSair } from '../components/BotaoSair';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { FormularioMovimentacoes } from '../components/FormularioMovimentacoes';

export function MovimentacoesScreen() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    try {
      setErro('');
      const [listaMovimentacoes, listaProdutos] = await Promise.all([
        movimentacaoApi.listar(),
        produtoApi.listar(),
      ]);
      setMovimentacoes(listaMovimentacoes);
      setProdutos(listaProdutos);
    } catch {
      setErro('Não foi possível carregar as movimentações e os produtos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Movimentações</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <ListaMovimentacoes movimentacoes={movimentacoes} carregando={carregando} />
      <FormularioMovimentacoes produtos={produtos} onMovimentacaoCriada={carregar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  erro: { color: '#dc2626', marginBottom: 10 },
});
