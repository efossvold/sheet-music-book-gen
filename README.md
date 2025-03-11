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

`./make_book.sh` or `bun run make-book`

## Create single sheet music with cover

`./add_cover_page.sh` or `bun run make-covered`

## Create all (covered) music sheets

`./add_cover_pages.sh` or `bun run make-all-covered`
