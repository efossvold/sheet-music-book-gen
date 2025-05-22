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

## Create sheet music book for scores in $SCORES_DIR

`mise run make-book`

## Add cover to a sheet music PDF

`mise run add-cover-page path/to/pdf`

## Add cover to all PDFs in $SCORES_DIR

`mise run add-cover-pages`

## Create ToC PDF for PDFs in $COVERED_DEST_DIR

`mise run create-folder-toc`
