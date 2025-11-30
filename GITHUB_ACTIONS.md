# GitHub Actions - Build Automático do APK 🚀

## Visão Geral

Este projeto inclui um workflow de GitHub Actions que compila automaticamente o APK do MindVault sempre que houver mudanças no código.

## Funcionalidades do Workflow

### Triggers Automáticos

O build é acionado automaticamente quando:

- ✅ Push para branch `main` ou `release`
- ✅ Criação de tags (ex: `v1.0.0`, `v1.1.0`)
- ✅ Pull Requests para `main`
- ✅ Manualmente via "Run workflow" no GitHub

### O que o Workflow Faz

1. **Setup do Ambiente**:
   - Node.js 20
   - JDK 17
   - Android SDK
   - Cache de dependências (npm + gradle)

2. **Build**:
   - Compila Release APK (otimizado)
   - Compila Debug APK (com logs)
   - Gera informações de tamanho

3. **Artefatos**:
   - Upload automático dos APKs
   - Retenção de 30 dias
   - Disponível na aba "Actions" do repositório

4. **Releases (em tags)**:
   - Cria release automático no GitHub
   - Anexa os APKs
   - Gera release notes

5. **Lint & Type Check**:
   - Executa ESLint
   - Verifica tipos TypeScript

## Como Usar

### 1. Fazer Push de Código

```bash
cd ~/MindVault
git add .
git commit -m "feat: adiciona integração com Ollama"
git push origin main
```

O workflow iniciará automaticamente!

### 2. Criar uma Release

```bash
# Criar tag
git tag -a v1.0.0 -m "Release v1.0.0 - AI Integration"
git push origin v1.0.0
```

Isso cria:
- Build automático
- Release no GitHub com APKs anexados
- Release notes geradas automaticamente

### 3. Executar Manualmente

1. Vá para: `github.com/SEU_USUARIO/MindVault/actions`
2. Selecione "Android Release Build"
3. Clique em "Run workflow"
4. Escolha a branch
5. Clique em "Run workflow" novamente

### 4. Baixar o APK

Após o workflow completar:

1. Vá para: `github.com/SEU_USUARIO/MindVault/actions`
2. Clique no workflow executado
3. Na seção "Artifacts", baixe:
   - `mindvault-release` (APK otimizado)
   - `mindvault-debug` (APK com logs)

## Estrutura do Workflow

```yaml
.github/workflows/
└── android-release.yml    # Workflow principal
```

## Jobs Incluídos

### 1. Build Job

- **Runners**: `ubuntu-latest`
- **Tempo médio**: 5-10 minutos
- **Outputs**:
  - Release APK (~20-30 MB)
  - Debug APK (~25-35 MB)

### 2. Lint Job

- **Runners**: `ubuntu-latest`
- **Tempo médio**: 1-2 minutos
- **Verifica**:
  - Código JavaScript/TypeScript
  - Tipos TypeScript

## Configuração Adicional (Opcional)

### Assinar APK para Produção

Para criar APKs assinados para a Play Store:

1. **Gerar Keystore**:
   ```bash
   keytool -genkey -v -keystore mindvault-release.keystore \
     -alias mindvault -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Adicionar Secrets no GitHub**:
   - Vá para: `Settings → Secrets and variables → Actions`
   - Adicione:
     - `KEYSTORE_FILE` (base64 do keystore)
     - `KEYSTORE_PASSWORD`
     - `KEY_ALIAS`
     - `KEY_PASSWORD`

3. **Atualizar Workflow**:
   Adicione antes do build:
   ```yaml
   - name: Decode Keystore
     run: |
       echo "${{ secrets.KEYSTORE_FILE }}" | base64 -d > android/app/mindvault-release.keystore
   ```

4. **Configurar gradle.properties**:
   ```properties
   MINDVAULT_RELEASE_STORE_FILE=mindvault-release.keystore
   MINDVAULT_RELEASE_KEY_ALIAS=${{ secrets.KEY_ALIAS }}
   MINDVAULT_RELEASE_STORE_PASSWORD=${{ secrets.KEYSTORE_PASSWORD }}
   MINDVAULT_RELEASE_KEY_PASSWORD=${{ secrets.KEY_PASSWORD }}
   ```

### Notificações

Para receber notificações do build:

1. Vá para: `github.com/SEU_USUARIO/MindVault/settings/installations`
2. Configure o GitHub Mobile
3. Ative notificações para "Actions"

## Troubleshooting

### Build Falha: "Gradle daemon"

**Causa**: Memória insuficiente no runner

**Solução**: O workflow já usa `--no-daemon` para evitar isso

### Build Falha: "SDK not found"

**Causa**: Android SDK não instalado corretamente

**Solução**: O workflow usa `android-actions/setup-android@v3` que resolve automaticamente

### APK muito grande

**Causa**: Todas as arquiteturas incluídas (arm64-v8a, armeabi-v7a, x86, x86_64)

**Solução**: Editar `android/app/build.gradle`:
```groovy
splits {
    abi {
        enable true
        reset()
        include 'arm64-v8a', 'armeabi-v7a'
        universalApk false
    }
}
```

### Cache não funciona

**Causa**: Mudanças frequentes em gradle

**Solução**: O workflow já usa cache com hash de arquivos gradle

## Monitoramento

### Ver Status do Build

```bash
# Via CLI (GitHub CLI)
gh run list
gh run view RUN_ID
```

### Badges

Adicione ao README.md:

```markdown
![Android Build](https://github.com/SEU_USUARIO/MindVault/actions/workflows/android-release.yml/badge.svg)
```

## Performance

### Tempos Típicos

| Etapa | Tempo |
|-------|-------|
| Setup | 1-2 min |
| Dependencies | 1-2 min |
| Gradle Build | 3-6 min |
| Upload | 30-60 seg |
| **Total** | **5-10 min** |

### Otimizações Aplicadas

- ✅ Cache de npm packages
- ✅ Cache de Gradle
- ✅ Uso de `--no-daemon`
- ✅ Parallel builds quando possível

## Limites do GitHub Actions

- **Runners Free**: 2000 minutos/mês
- **Storage**: 500 MB de artifacts
- **Concurrent jobs**: 20 (free tier)

**Estimativa para este projeto**: ~6 minutos por build = ~330 builds/mês

## Próximas Melhorias

- [ ] Deploy automático para Play Store (Internal Testing)
- [ ] Testes automatizados com Detox/Maestro
- [ ] Build de diferentes flavors (dev, staging, prod)
- [ ] Análise de bundle size
- [ ] Notificações no Discord/Slack

## Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [React Native CI/CD](https://reactnative.dev/docs/running-on-device)
- [Android Gradle Plugin](https://developer.android.com/studio/releases/gradle-plugin)

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
