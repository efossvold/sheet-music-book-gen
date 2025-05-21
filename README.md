# README

Automatically merge music sheet andd generate TOC with titles/composers.

## Prerequisites

```
brew install mise poppler qpdf ruby
gem i pdfunite
mise i
bun i
pip install -U -r requirements.txt
```

## Create sheet music book

`mise run make-book`

## Create single sheet music with cover

`mise run make-covered`

## Create all (covered) music sheets

`mise run make-all-covered`
