import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

type Item = {
  slug: string;
  content: string;
  title: string;
  date: string;
  tags: string[];
}

// Markdownファイルが格納されているディレクトリ
const contentDir = join(process.cwd(), "content");

type GetContentSlugs = () => string[];
// content配下にあるディレクトリ名を取得
export const getContentSlugs: GetContentSlugs = () => {
  const informations = fs.readdirSync(contentDir, { withFileTypes: true });
  const result = informations.filter((information) => information.isDirectory()).map(({ name }) => name);
  return result;
};

type GetContentBySlug = (slug: string, fields: string[]) => Item;
// 引数のslugから記事の内容をparseする関数
export const getContentBySlug: GetContentBySlug = (slug, fields) => {
  // 対象のファイルを読み込むためのパスを作成する
  const path = join(contentDir, slug, "index.md");
  // 作成したパスからファイルを読み込む
  const file = fs.readFileSync(path, "utf8");
  // gray-matterを使ってyamlのheaderとbodyを分割する
  // matter()から返却されるオブジェクト
  /*
    {
      content: '<h1>Hello world!</h1>',
      data: { 
        title: 'Hello', 
        slug: 'home' 
      }
    }
  */
  const { data, content } = matter(file);

  // 記事のメタデータ
  const metadata: Item = {
    slug: "",
    content: "",
    title: "",
    date: "",
    tags: [],
  }

  // 与えられた記事データの配列を1要素ずつ見ていき、metadataオブジェクトに格納する
  fields.forEach((field) => {
    if (field === "slug") metadata[field] = slug;
    if (field === "content") metadata[field] = content;
    if (field === "title" || field === "date" || field === "tags") metadata[field] = data[field];
  });
  return metadata;
};

type GetAllContents = (fields: string[]) => Item[];
export const getAllContents: GetAllContents = (fields) => {
  const slugs = getContentSlugs();

  const contents = slugs.map((slug) => getContentBySlug(slug, fields))
    .sort((a, b) => {
      const slugA = a.slug.toString().toLowerCase();
      const slugB = b.slug.toString().toLowerCase();

      if (slugA > slugB) return 1;
      else slugA < slugB;

      return slugA >= slugB ? 1 : -1;
    });

  return contents;
};
