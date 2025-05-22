#!/usr/bin/env fish
set START_TIME (date +%s)

#MISE description="Add cover page to PDF sheet music file"
#USAGE arg "<file>" help="The file to add cover page to"

set FILEPATH $usage_file

if test -e $FILEPATH
else
  echo $FILEPATH not found
  exit
end

if test -d $TMP_DIR; rm -rf $TMP_DIR; end
mkdir $TMP_DIR

set BASENAME (basename $FILEPATH)
set DEST_FILE "$COVERED_DEST_DIR/$BASENAME"
set TITLE (echo $BASENAME | awk -F ' - '  '{print $1}')
set COMPOSER (path basename -E $BASENAME | awk -F ' - '  '{print $2}')

echo Processing $BASENAME

if test -z $TITLE
  echo Title not found
  exit
end

if test -z $COMPOSER
  echo Composer not found
  exit
end

echo Title: $TITLE
echo Composer: $COMPOSER

echo Generating cover page
bun src/add_cover_page.ts $FILEPATH $TITLE $COMPOSER
or exit

echo Inserting cover page $BASENAME
qpdf --warning-exit-0 --empty --pages $TMP_DIR/cover.pdf $FILEPATH 1-z -- $DEST_FILE

echo Wrote $DEST_FILE

echo PDF created in (math (date +%s) - $START_TIME)s
