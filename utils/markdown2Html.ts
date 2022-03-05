import { remark } from "remark";
import html from "remark-html";

type Markdown2Html = (md: string) => Promise<string>;
// Markdownファイルをテキストに変換する関数
// remarkを使用している
const markdown2Html: Markdown2Html = async (md) => {
  return (await remark().use(html).process(md)).toString();
};

export default markdown2Html;
