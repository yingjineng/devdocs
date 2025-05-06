# 文件抓取器参考

本页列出了使用 `FileScraper` 的文档及其部分构建说明。

如果你提交 PR 更新这些文档，请补充或修正相关说明。

## Dart

点击 https://www.dartlang.org/tools/sdk/archive 页面 “Stable channel” 标题下的 “API docs” 链接。将下载的 ZIP 文件重命名为 `dart~2` 并放入 `docs/` 目录。

或者在终端运行以下命令：

```sh
curl https://storage.googleapis.com/dart-archive/channels/stable/release/$RELEASE/api-docs/dartdocs-gen-api.zip > dartApi.zip; \
unzip dartApi.zip; mv gen-dartdocs docs/dart~$VERSION
```

## date-fns

```sh
git clone https://github.com/date-fns/date-fns docs/date_fns
cd docs/date_fns
git checkout v2.29.2
yarn install
node scripts/build/docs.js
ls tmp/docs.json
```

## Django

访问 https://docs.djangoproject.com/，在右下角选择版本，然后从侧边栏下载 HTML 版本。

```sh
mkdir --parent docs/django\~$VERSION/; \
curl https://media.djangoproject.com/docs/django-docs-$VERSION-en.zip | \
bsdtar --extract --file - --directory=docs/django\~$VERSION/
```

## Elisp

访问 https://www.gnu.org/software/emacs/manual/elisp.html，下载 HTML 压缩包并解压到 `docs/elisp`，或运行以下命令：

```sh
mkdir docs/elisp \
&& curl curl https://www.gnu.org/software/emacs/manual/elisp.html_node.tar.gz | \
tar --extract --gzip --strip-components=1 --directory=docs/elisp
```

## Erlang

访问 https://www.erlang.org/downloads 并下载 HTML 文档文件。

```ah
mkdir --parent docs/erlang\~$VERSION/; \
curl -L https://github.com/erlang/otp/releases/download/OTP-$RELEASE/otp_doc_html_$RELEASE.tar.gz | \
bsdtar --extract --file - --directory=docs/erlang\~$VERSION/
```

## Gnu

### Bash
访问 https://www.gnu.org/software/bash/manual/，下载 HTML 压缩包（每个节点一个网页），并解压到 `docs/bash`，或运行：

```sh
mkdir docs/bash \
&& curl https://www.gnu.org/software/bash/manual/bash.html_node.tar.gz | \
tar --extract --gzip --directory=docs/bash
```

### GCC
访问 https://gcc.gnu.org/onlinedocs/ 并下载 GCC 手册和 GCC CPP 手册的 HTML 压缩包，或运行：

```sh
# GCC 手册
mkdir docs/gcc~${VERSION}; \
curl https://gcc.gnu.org/onlinedocs/gcc-$RELEASE/gcc-html.tar.gz | \
tar --extract --gzip --strip-components=1 --directory=docs/gcc~${VERSION}

# GCC CPP 手册
mkdir docs/gcc~${VERSION}_cpp; \
curl https://gcc.gnu.org/onlinedocs/gcc-$RELEASE/cpp-html.tar.gz | \
tar --extract --gzip --strip-components=1 --directory=docs/gcc~${VERSION}_cpp
```

### GNU Fortran
访问 https://gcc.gnu.org/onlinedocs/ 并下载 Fortran 手册的 HTML 压缩包，或运行：

```sh
mkdir docs/gnu_fortran~$VERSION; \
curl https://gcc.gnu.org/onlinedocs/gcc-$RELEASE/gfortran-html.tar.gz | \
tar --extract --gzip --strip-components=1 --directory=docs/gnu_fortran~$VERSION
```

## GNU Make
访问 https://www.gnu.org/software/make/manual/，下载 HTML 压缩包并解压到 `docs/gnu_make`，或运行：

```sh
mkdir docs/gnu_make \
&& curl https://www.gnu.org/software/make/manual/make.html_node.tar.gz | \
tar --extract --gzip --strip-components=1 --directory=docs/gnu_make
```

## Gnuplot

最新版可在 https://sourceforge.net/p/gnuplot/gnuplot-main/ref/master/tags/ 页面底部找到。

```sh
DEVDOCS_ROOT=/path/to/devdocs
mkdir gnuplot-src $DEVDOCS_ROOT/docs/gnuplot
git clone -b $RELEASE --depth 1 https://git.code.sf.net/p/gnuplot/gnuplot-main ./gnuplot-src
cd gnuplot-src/
./prepare
./configure
cd docs/
make nofigures.tex
latex2html -html 5.0,math -split 4 -link 8 -long_titles 5 -dir $DEVDOCS_ROOT/docs/gnuplot -ascii_mode -no_auto_link nofigures.tex
```

在 macOS 上安装 `latex2html`：`brew install basictex latex2html`，然后编辑 `/usr/local/Cellar/latex2html/2019.2/l2hconf.pm`，添加 LaTeX 路径：

<details>

大约在第 21 行：

```
#  配置系统中 latex 和 dvips 的路径:
#
$LATEX = '/Library/TeX/texbin/latex';	# LaTeX
$PDFLATEX = '/Library/TeX/texbin/pdflatex';	# pdfLaTeX
$LUALATEX = '/Library/TeX/texbin/lualatex';	# LuaLaTeX
$DVILUALATEX = '/Library/TeX/texbin/dvilualatex';	# dviLuaLaTeX
$DVIPS = '/Library/TeX/texbin/dvips';	# dvips
$DVIPNG = '';	# dvipng
$PDFTOCAIRO = '/usr/local/bin/pdf2svg';	# pdf 转 svg
$PDFCROP = '';	# pdfcrop
$GS = '/usr/local/opt/ghostscript/bin/gs';	# GhostScript
```
</details>

## Man

```sh
wget --recursive --no-parent https://man7.org/linux/man-pages/
mv man7.org/linux/man-pages/ docs/man/
```

## NumPy

```sh
mkdir --parent docs/numpy~$VERSION/; \
curl https://numpy.org/doc/$VERSION/numpy-html.zip | \
bsdtar --extract --file=- --directory=docs/numpy~$VERSION/
```

## OpenGL

```sh
cd docs/
git clone https://github.com/KhronosGroup/OpenGL-Refpages.git
ln -s OpenGL-Refpages/gl4/html/ opengl~4
ln -s OpenGL-Refpages/gl2.1/xhtml/ opengl~2.1
```

## OpenJDK
在 https://www.debian.org/distrib/packages 搜索 'Openjdk'，找到 `openjdk-$VERSION-doc` 包，下载后用 `dpkg -x $PACKAGE ./` 解压，并将 `./usr/share/doc/openjdk-16-jre-headless/api/` 移动到 `path/to/devdocs/docs/openjdk~$VERSION`

```sh
curl -O http://ftp.at.debian.org/debian/pool/main/o/openjdk-21/openjdk-21-doc_21.0.2+13-2_all.deb
tar xf openjdk-21-doc_21.0.2+13-2_all.deb
tar xf data.tar.xz
mv ./usr/share/doc/openjdk-21-jre-headless/api/ docs/openjdk~$VERSION
```

如果你使用或有 Debian 系 GNU/Linux，可以运行：

```sh
apt download openjdk-$VERSION-doc
dpkg -x $PACKAGE ./
# 上述命令会在当前目录生成 'usr' 目录
mv ./usr/share/doc/openjdk-16-jre-headless/api/ docs/openjdk~$VERSION
```

## Pandas

在主目录下（`devdocs`），执行：

```sh
curl https://pandas.pydata.org/docs/pandas.zip -o tmp.zip && unzip tmp.zip -d docs/pandas~2 && rm tmp.zip
```

## PHP
在 https://www.php.net/download-docs.php 页面点击 “Many HTML files” 列下的链接，解压后重命名为 `php` 并放入 `docs/`。

或者运行：

```sh
curl https://www.php.net/distributions/manual/php_manual_en.tar.gz | tar xz; mv php-chunked-xhtml/ docs/php/
```

## Python 3.6+

```sh
mkdir docs/python~$VERSION
cd docs/python~$VERSION
curl -L https://docs.python.org/$VERSION/archives/python-$RELEASE-docs-html.tar.bz2 | \
tar xj --strip-components=1
```

## Python < 3.6

```sh
mkdir docs/python~$VERSION
cd docs/python~$VERSION
curl -L https://docs.python.org/ftp/python/doc/$RELEASE/python-$RELEASE-docs-html.tar.bz2 | \
tar xj --strip-components=1
```

## R

```bash
sudo dnf install bzip2-devel
sudo dnf install gcc-gfortran
sudo dnf install libcurl-devel
sudo dnf install texinfo
sudo dnf install xz-devel

DEVDOCSROOT=docs/r
RLATEST=https://cran.r-project.org/src/base/R-latest.tar.gz # 或 /R-${VERSION::1}/R-$VERSION.tar.gz

RSOURCEDIR=${TMPDIR:-/tmp}/R/latest
RBUILDDIR=${TMPDIR:-/tmp}/R/build
mkdir -p "$RSOURCEDIR" "$RBUILDDIR" "$DEVDOCSROOT"

# 下载、配置并构建静态 HTML 页面
curl "$RLATEST" | tar -C "$RSOURCEDIR" -xzf - --strip-components=1
(cd "$RBUILDDIR" && "$RSOURCEDIR/configure" --enable-prebuilt-html --with-recommended-packages --disable-byte-compiled-packages --disable-shared --disable-java --with-readline=no --with-x=no)
make _R_HELP_LINKS_TO_TOPICS_=FALSE -C "$RBUILDDIR"

# 导出所有生成的 html 文档（全局和每个包）
cp -r "$RBUILDDIR/doc" "$DEVDOCSROOT/"
ls -d "$RBUILDDIR"/library/*/html | while read orig; do
    dest="$DEVDOCSROOT${orig#$RBUILDDIR}"
    mkdir -p "$dest" && cp -r "$orig"/* "$dest/"
done
```

## RDoc

### Nokogiri
### Ruby / Minitest

```sh
git clone https://github.com/seattlerb/minitest
cd minitest/
bundle install
bundle add rdoc hoe
bundle exec rak docs
cd ..
cp -r minitest/docs $DEVDOCS/docs/minitest
```

### Ruby on Rails
* 在 https://github.com/rails/rails/releases 下载发布包，或克隆 https://github.com/rails/rails.git（切换到要抓取的 rails 版本分支）
* 打开 `railties/lib/rails/api/task.rb`，注释掉与 sdoc（`configure_sdoc`）相关的代码
* 在 Rails 目录下运行 `bundle config set --local without 'db job'`
* 运行 `bundle install && bundle exec rake rdoc`
* 进入 guides 目录并生成 HTML 指南：`cd guides && bundle exec rake guides:generate:html && cd ..`
* 复制生成的指南到 html 目录：`cp -r guides/output html/guides`
* 复制 html 目录到 `$DEVDOCS/docs/rails~[version]`

### Ruby
从 https://www.ruby-lang.org/en/downloads/ 下载 Ruby 的压缩包，解压后在终端运行 `./configure && make html`（在 ruby 目录下），然后将 `.ext/html` 移动到 `path/to/devdocs/docs/ruby~$VERSION/`。

或者运行：

```sh
curl https://cache.ruby-lang.org/pub/ruby/$VERSION/ruby-$RELEASE.tar.gz > ruby.tar; \
tar -xf ruby.tar; cd ruby-$RELEASE; ./configure && make html; mv .ext/html path/to/devdocs/docs/ruby~$VERSION
```

生成 html 文件时只需运行 `make`，不会安装 Ruby，因此无需担心清理或卸载。

## Scala

见 `lib/docs/scrapers/scala.rb`

## SQLite

从 https://sqlite.org/download.html 下载文档，解压并重命名为 `docs/sqlite`

```sh
curl https://sqlite.org/2022/sqlite-doc-3400000.zip | bsdtar --extract --file - --directory=docs/sqlite/ --strip-components=1
```

## Three.js
从 https://github.com/mrdoob/three.js/tree/dev/files 下载文档，或运行以下命令：
请确保版本号与发布标签一致（如 r160），注意 r 前缀已包含，仅需填写数字。

```sh
curl https://codeload.github.com/mrdoob/three.js/tar.gz/refs/tags/r${VERSION} > threejs.tar.gz
tar -xzf threejs.tar.gz
mkdir -p docs/threejs~${VERSION}
mv three.js-r${VERSION}/list.json tmp/list.json
mv three.js-r${VERSION}/docs/* docs/threejs~${VERSION}/

rm -rf three.js-r${VERSION}/
rm threejs.tar.gz
```
