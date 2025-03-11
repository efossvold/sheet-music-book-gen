#!/usr/bin/env fish
set TMP_DIR tmp
set SCRIPT (basename (status -f))
set SCORES_DIR $HOME/Documents/MuseScore4/Scores
set DEST_DIR "$HOME/Documents/Music/Piano Sheet Music"
set START_TIME (date +%s)

rm -rf $TMP_DIR/*

set FILEPATH $argv[1]

if test -z $FILEPATH
  echo Usage: 
  echo $SCRIPT sheet_music.pdf
  exit 
end

if test -e $FILEPATH
else
  echo $FILEPATH not found
  exit
end


set BASENAME (basename $FILEPATH)
set DEST_FILE "$DEST_DIR/$BASENAME"
set TITLE (echo $BASENAME | awk -F ' - '  '{print $1}')
set COMPOSER (echo $BASENAME | awk -F ' - '  '{print $2}')

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

