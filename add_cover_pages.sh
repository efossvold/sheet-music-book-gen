#!/usr/bin/env fish
set SCRIPT (basename (status -f))
set SCORES_DIR $HOME/Documents/MuseScore4/Scores
set START_TIME (date +%s)

for i in (ls $SCORES_DIR/*.pdf | egrep -v "_1_|_2_|_3_");
  ./add_cover_page.sh $i
end

echo PDFs with cover page created in (math (date +%s) - $START_TIME)s
