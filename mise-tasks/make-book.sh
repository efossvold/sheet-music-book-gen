#!/usr/bin/env fish
set START_TIME (date +%s)

#MISE description="Create PDF sheet music book"

if test -d $TMP_DIR; rm -rf $TMP_DIR; end
mkdir $TMP_DIR

echo Generating titles
ls $SCORES_DIR | egrep -v "_1_|_2_|_3_" | sed 's/\.pdf$//g' > $TMP_DIR/files.txt
or exit
awk -F ' - '  '{print $1}' $TMP_DIR/files.txt > $TMP_DIR/titles.txt
or exit
awk -F ' - '  '{print $2}' $TMP_DIR/files.txt > $TMP_DIR/composers.txt
or exit

echo Merging PDFs
pdfunite $SCORES_DIR/*.pdf $TMP_DIR/in.pdf
or exit

echo Copying merged PDF
true > $TMP_DIR/recipe.toml
or exit

echo Generating recipe.toml
for i in (cat $TMP_DIR/titles.txt)
  pdfxmeta -a 1 $TMP_DIR/in.pdf "^$i\$" >> $TMP_DIR/recipe.toml
end

echo Generating TOC
pdftocgen $TMP_DIR/in.pdf < $TMP_DIR/recipe.toml > $TMP_DIR/toc.txt
or exit

echo
cat $TMP_DIR/toc.txt
echo

echo Generating TOC PDF
bun run tsx src/html2pdf.ts
or exit

echo Adding ToC page
qpdf --warning-exit-0 --empty --pages $TMP_DIR/in.pdf 1 $TMP_DIR/toc.pdf 1-2 $TMP_DIR/in.pdf 4-z -- $TMP_DIR/out_toc.pdf

# echo Adding page numbers
# bun run tsx src/add_page_numbers.ts $TMP_DIR/out_toc.pdf $TMP_DIR/out_toc_numbered.pdf
# or exit

# echo Adding page labels
# qpdf --set-page-labels 1://"Cover" 2://"ToC" 3:D/3 -- $TMP_DIR/out_toc_numbered.pdf $TMP_DIR/out_labeled.pdf
# or exit

# echo Adding internal ToC
# pdftocio -o $TMP_DIR/out.pdf $TMP_DIR/out_labeled.pdf < $TMP_DIR/toc.txt
# or exit

# echo Compress and flatten PDF
# pdfs $TMP_DIR/out.pdf --profile pdfsqueezer-flatten.pdfscp --replace --output $TMP_DIR/out_flat.pdf

# echo Creating print version
# qpdf --warning-exit-0 --empty --pages $ASSETS_DIR/blank_page.pdf $TMP_DIR/out_flat.pdf 2-z -- $TMP_DIR/out_print_flat.pdf

# echo Copy PDF to destination
# cp -vf $TMP_DIR/out_flat.pdf $BOOK_PDF

# echo PDF created in (math (date +%s) - $START_TIME)s
