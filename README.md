# CAPTCHaBreak

Showcase of an attack on CAPTCHaStar.



RUNNING:

1. Close all Chrome windows and re-run it with "--allow-file-access-from-files" flag
2. Open star.html
3. Open console, execute "find_min_fill_ratio()"

options:
  1.to load some other captcha, use the function load(), e.g.:
      load("getter3.php");  // "getter.php", "getter1.php", ... "getter19.php" will work
  2. you can also specify the total number of bins per row/column:
      find_min_fill_ratio(30);   // default is 20
