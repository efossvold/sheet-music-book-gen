# README

Automatically merge music sheet andd generate TOC with titles/composers.

## Prerequisites

```
brew install poppler qpdf ruby pyenv pyenv-virtualenv
gem install pdfunite
pip install -U pdf.tocgen
pyenv virtualenv 3.12.7 sheet-music-book-gen-3.12.7
pyenv activate
```

## Create sheet music book

`./make_book.sh` or `npm run make`
