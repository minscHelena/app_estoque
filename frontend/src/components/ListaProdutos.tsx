import { ActivityIndicator, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
  carregando?: boolean;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function ListaProduto({ produtos, carregando = false }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.id, styles.celulaCabecalho]}>ID</Text>
          <Text style={[styles.celula, styles.nome, styles.celulaCabecalho]}>Nome</Text>
          <Text style={[styles.celula, styles.categoria, styles.celulaCabecalho]}>Categoria</Text>
          <Text style={[styles.celula, styles.preco, styles.celulaCabecalho]}>Preço</Text>
          <Text style={[styles.celula, styles.quantidade, styles.celulaCabecalho]}>Quantidade</Text>
        </View>

        {carregando ? (
          <ActivityIndicator style={styles.estado} />
        ) : produtos.length === 0 ? (
          <Text style={styles.mensagemVazia}>Nenhum produto cadastrado.</Text>
        ) : (
          produtos.map((produto) => (
            <View key={produto.id} style={styles.linha}>
              <Text style={[styles.celula, styles.id]}>{produto.id}</Text>
              <Text style={[styles.celula, styles.nome]}>{produto.nome}</Text>
              <Text style={[styles.celula, styles.categoria]}>
                {produto.categoria?.nome ?? 'Sem categoria'}
              </Text>
              <Text style={[styles.celula, styles.preco]}>{formatarPreco(produto.preco)}</Text>
              <Text style={[styles.celula, styles.quantidade]}>{produto.quantidade}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabela: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    minWidth: 560,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  cabecalho: { backgroundColor: '#f5f5f5' },
  celula: { fontSize: 12, paddingHorizontal: 5 },
  celulaCabecalho: { fontWeight: '700' },
  id: { width: 45 },
  nome: { width: 155 },
  categoria: { width: 125 },
  preco: { width: 100 },
  quantidade: { width: 100, textAlign: 'right' },
  estado: { padding: 20 },
  mensagemVazia: { color: '#666', textAlign: 'center', padding: 16 },
});
