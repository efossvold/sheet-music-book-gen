#!/usr/bin/env fish
set START_TIME (date +%s)

#MISE description="Add cover page to all PDF sheet music files"

for i in (ls $SCORES_DIR/*.pdf | egrep -v "_1_|_2_|_3_");
  mise run add-cover-page $i
end

echo PDFs with cover page created in (math (date +%s) - $START_TIME)s
