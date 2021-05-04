@echo off

echo %cd% | find /i ".git" && cls
if %errorlevel% equ 0 (
    msg /w * "Muito bem vamos comecar !"
) else (
    msg /w * "O diretoria deve terminar com o final .git !"
    exit 1
)

REM INICIALIZANDO O GIT
git init
msg /w * Sucesso na inicializacao!
timeout 1

REM CRIANDO README
copy NUL README.md
msg /w * README criado !
timeout 1

REM ADICIOANDO ARQUIVOS
git add .
msg /w * Arquivos adicionados !
timeout 1

REM COMITANDO ARQUIVOS
git commit -m "Deploy automatizado via batch file"
msg /w * Arquivos commitados !
timeout 1

REM SOLICITANDO ENDEREÇO
set /p repositorio="Digite o endereco para envio >"
git remote add origin %repositorio%
msg /w * Adicionado ao repositorio !

REM ENVIANDO ARQUIVOS
git push -u origin master
msg /w * Arquivos enviados !


pause