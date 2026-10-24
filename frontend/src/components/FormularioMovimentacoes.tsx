import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Produto, TipoMovimentacao } from '../types';
import { movimentacaoApi } from '../api/api';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => Promise<void> | void;
}

export function FormularioMovimentacoes({ produtos, onMovimentacaoCriada }: Props) {
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<TipoMovimentacao | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [mostrarTipos, setMostrarTipos] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const produtoSelecionado = produtos.find((p) => p.id === produtoId);

  async function handleSubmit() {
    const qtdTexto = quantidade.trim();

    // Validação de campos obrigatórios
    if (produtoId === null || !tipo || !qtdTexto) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    const qtdNumerica = Number(qtdTexto);
    if (!Number.isInteger(qtdNumerica) || qtdNumerica <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    setErro('');
    setSalvando(true);

    try {
      await movimentacaoApi.criar({
        produtoId,
        tipo,
        quantidade: qtdNumerica,
      });

      await onMovimentacaoCriada();

      // Limpar formulário após o registro
      setProdutoId(null);
      setTipo(null);
      setQuantidade('');
      setMostrarProdutos(false);
      setMostrarTipos(false);
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.message || 'Não foi possível registrar a movimentação.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Nova Movimentação</Text>

      {/* Seletor de Produto com estoque atual */}
      <Text style={styles.rotulo}>Produto</Text>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => {
          setMostrarProdutos((visivel) => !visivel);
          setMostrarTipos(false);
        }}
        accessibilityRole="button"
        accessibilityLabel="Selecionar produto"
      >
        <Text style={produtoSelecionado ? styles.textoSeletor : styles.placeholder}>
          {produtoSelecionado
            ? `${produtoSelecionado.nome} (Estoque: ${produtoSelecionado.quantidade})`
            : 'Selecione um produto'}
        </Text>
        <Text style={styles.seta}>{mostrarProdutos ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {mostrarProdutos && (
        <View style={styles.opcoes}>
          {produtos.length === 0 ? (
            <Text style={styles.mensagemVazia}>Nenhum produto cadastrado.</Text>
          ) : (
            produtos.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.opcao,
                  produtoId === p.id && styles.opcaoSelecionada,
                ]}
                onPress={() => {
                  setProdutoId(p.id);
                  setMostrarProdutos(false);
                }}
              >
                <Text style={styles.textoOpcao}>
                  {p.nome} <Text style={styles.textoEstoque}>(Estoque: {p.quantidade})</Text>
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Seletor de Tipo (Entrada ou Saída) */}
      <Text style={styles.rotulo}>Tipo de Movimentação</Text>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => {
          setMostrarTipos((visivel) => !visivel);
          setMostrarProdutos(false);
        }}
        accessibilityRole="button"
        accessibilityLabel="Selecionar tipo de movimentação"
      >
        <Text style={tipo ? styles.textoSeletor : styles.placeholder}>
          {tipo === 'ENTRADA' ? 'Entrada' : tipo === 'SAIDA' ? 'Saída' : 'Selecione o tipo'}
        </Text>
        <Text style={styles.seta}>{mostrarTipos ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {mostrarTipos && (
        <View style={styles.opcoes}>
          <TouchableOpacity
            style={[styles.opcao, tipo === 'ENTRADA' && styles.opcaoSelecionada]}
            onPress={() => {
              setTipo('ENTRADA');
              setMostrarTipos(false);
            }}
          >
            <Text style={[styles.textoOpcao, styles.textoEntrada]}>Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.opcao, tipo === 'SAIDA' && styles.opcaoSelecionada]}
            onPress={() => {
              setTipo('SAIDA');
              setMostrarTipos(false);
            }}
          >
            <Text style={[styles.textoOpcao, styles.textoSaida]}>Saída</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quantidade */}
      <Text style={styles.rotulo}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 10"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
        accessibilityLabel="Quantidade a movimentar"
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={[
          styles.botao,
          (salvando || produtos.length === 0) && styles.botaoDesabilitado,
        ]}
        onPress={handleSubmit}
        disabled={salvando || produtos.length === 0}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Registrar movimentação'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 24,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  rotulo: {
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 12,
  },
  seletor: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 11,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textoSeletor: {
    color: '#222',
    fontWeight: '500',
  },
  placeholder: {
    color: '#888',
  },
  seta: {
    color: '#555',
    marginLeft: 8,
  },
  opcoes: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  opcao: {
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  opcaoSelecionada: {
    backgroundColor: '#eff6ff',
  },
  textoOpcao: {
    color: '#222',
  },
  textoEstoque: {
    color: '#666',
    fontWeight: '400',
  },
  textoEntrada: {
    color: '#15803d',
    fontWeight: '600',
  },
  textoSaida: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  mensagemVazia: {
    color: '#666',
    padding: 12,
  },
  erro: {
    color: '#dc2626',
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
