      import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Categoria } from '../types';
import { produtoApi } from '../api/api';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => Promise<void> | void;
}

export function FormularioProtudo({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const categoriaSelecionada = categorias.find(
    (categoria) => categoria.id === categoriaId,
  );

  async function handleSubmit() {
    const nomeLimpo = nome.trim();
    const precoTexto = preco.trim();
    const quantidadeTexto = quantidade.trim();

    if (!nomeLimpo || !precoTexto || !quantidadeTexto || categoriaId === null) {
      setErro('Preencha todos os campos e selecione uma categoria.');
      return;
    }

    const precoNumerico = Number(precoTexto.replace(',', '.'));
    const quantidadeNumerica = Number(quantidadeTexto);

    if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
      setErro('Informe um preço válido e não negativo.');
      return;
    }

    if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
      setErro('Informe uma quantidade inteira e não negativa.');
      return;
    }

    setErro('');
    setSalvando(true);

    try {
      await produtoApi.criar({
        nome: nomeLimpo,
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
        categoriaId,
      });

      await onProdutoCriado();
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId(null);
      setMostrarCategorias(false);
    } catch {
      setErro('Não foi possível cadastrar o produto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Novo Produto</Text>

      <Text style={styles.rotulo}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
        accessibilityLabel="Nome do produto"
      />

      <Text style={styles.rotulo}>Preço (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 8,50"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
        accessibilityLabel="Preço do produto em reais"
      />

      <Text style={styles.rotulo}>Quantidade inicial</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade em estoque"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
        accessibilityLabel="Quantidade inicial em estoque"
      />

      <Text style={styles.rotulo}>Categoria</Text>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => setMostrarCategorias((visivel) => !visivel)}
        accessibilityRole="button"
        accessibilityLabel="Selecionar categoria"
      >
        <Text style={categoriaSelecionada ? styles.textoSeletor : styles.placeholder}>
          {categoriaSelecionada?.nome ?? 'Selecione uma categoria'}
        </Text>
        <Text style={styles.seta}>{mostrarCategorias ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {mostrarCategorias && (
        <View style={styles.opcoes}>
          {categorias.length === 0 ? (
            <Text style={styles.mensagemVazia}>
              Cadastre uma categoria antes de cadastrar um produto.
            </Text>
          ) : (
            categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.opcao,
                  categoriaId === categoria.id && styles.opcaoSelecionada,
                ]}
                onPress={() => {
                  setCategoriaId(categoria.id);
                  setMostrarCategorias(false);
                }}
              >
                <Text style={styles.textoOpcao}>{categoria.nome}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={[
          styles.botao,
          (salvando || categorias.length === 0) && styles.botaoDesabilitado,
        ]}
        onPress={handleSubmit}
        disabled={salvando || categorias.length === 0}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Cadastrar produto'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 22 },
  titulo: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  rotulo: { fontWeight: '500', marginBottom: 5 },
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
  },
  textoSeletor: { color: '#222' },
  placeholder: { color: '#888' },
  seta: { color: '#555', marginLeft: 8 },
  opcoes: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
  },
  opcao: { padding: 11, borderBottomWidth: 1, borderBottomColor: '#eee' },
  opcaoSelecionada: { backgroundColor: '#eff6ff' },
  textoOpcao: { color: '#222' },
  mensagemVazia: { color: '#666', padding: 12 },
  erro: { color: '#dc2626', marginBottom: 10 },
  botao: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
