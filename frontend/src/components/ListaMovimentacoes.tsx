import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
  carregando?: boolean;
}

export function formatarDataHora(isoString: string): string {
  try {
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return isoString;

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  } catch {
    return isoString;
  }
}

export function ListaMovimentacoes({ movimentacoes, carregando = false }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.colData, styles.celulaCabecalho]}>Data/Hora</Text>
          <Text style={[styles.celula, styles.colProduto, styles.celulaCabecalho]}>Produto</Text>
          <Text style={[styles.celula, styles.colTipo, styles.celulaCabecalho]}>Tipo</Text>
          <Text style={[styles.celula, styles.colQuantidade, styles.celulaCabecalho]}>Qtd</Text>
        </View>

        {carregando ? (
          <ActivityIndicator style={styles.estado} />
        ) : movimentacoes.length === 0 ? (
          <Text style={styles.mensagemVazia}>Nenhuma movimentação registrada.</Text>
        ) : (
          movimentacoes.map((mov) => {
            const isEntrada = mov.tipo === 'ENTRADA';
            return (
              <View key={mov.id} style={styles.linha}>
                <Text style={[styles.celula, styles.colData]}>
                  {formatarDataHora(mov.criadoEm)}
                </Text>
                <Text style={[styles.celula, styles.colProduto]}>
                  {mov.produto?.nome ?? 'Produto não identificado'}
                </Text>
                <View style={[styles.celula, styles.colTipo]}>
                  <View
                    style={[
                      styles.badge,
                      isEntrada ? styles.badgeEntrada : styles.badgeSaida,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeTexto,
                        isEntrada ? styles.badgeTextoEntrada : styles.badgeTextoSaida,
                      ]}
                    >
                      {isEntrada ? 'Entrada' : 'Saída'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.celula, styles.colQuantidade]}>
                  {mov.quantidade}
                </Text>
              </View>
            );
          })
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
    minWidth: 480,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  cabecalho: {
    backgroundColor: '#f5f5f5',
  },
  celula: {
    fontSize: 13,
    paddingHorizontal: 6,
    color: '#333',
  },
  celulaCabecalho: {
    fontWeight: '700',
    color: '#111',
  },
  colData: {
    width: 140,
  },
  colProduto: {
    width: 170,
  },
  colTipo: {
    width: 100,
    justifyContent: 'center',
  },
  colQuantidade: {
    width: 70,
    textAlign: 'right',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  badgeEntrada: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  badgeSaida: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextoEntrada: {
    color: '#15803d',
  },
  badgeTextoSaida: {
    color: '#b91c1c',
  },
  estado: {
    padding: 20,
  },
  mensagemVazia: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});
