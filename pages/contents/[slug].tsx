// 各ブログページ本体

import { NextPage, InferGetStaticPropsType } from "next";
import { getAllContents, getContentBySlug } from "../../utils/api";
import markdown2Html from "../../utils/markdown2Html";

type Props = InferGetStaticPropsType<typeof getStaticProps>
type StaticPath = {
  paths: {
      params: {
          slug: string;
      };
  }[];
  fallback: boolean;
};

type GetStaticPaths = () => Promise<StaticPath>;
// getStaticPaths: Dynamic Route利用中でもnext exportにより静的なファイルを生成するAPI
export const getStaticPaths: GetStaticPaths = async () => {
  const contents = getAllContents(["slug"]);
  const result: StaticPath = {
    paths: contents.map((content) => {
      return {
        params: {
          slug: content.slug,
        },
      };
    }),
    fallback: false, // falseだと、存在しないページにアクセスした場合は常に404となる
  };
  return result;
};

export const getStaticProps = async ({ params }: any) => {
  const content = getContentBySlug(params.slug, [
    "slug",
    "title",
    "date",
    "tags",
    "content"
  ]);

  const contentText = await markdown2Html(content.content);

  return {
    props: {
      content: {
        ...content,
        contentText,
      }
    },
  }
};

const Post: NextPage<Props> = ({ content }) => {
  return (
    // https://developer.mozilla.org/ja/docs/Web/HTML/Element/article
    <article>
      <h2>{content.title}</h2>
      <p>{content.date}</p>
      <ul>
        {content.tags.map((tag) => {
          return <li key={tag}>{tag}</li>
        })}
      </ul>
      {/* https://developer.mozilla.org/ja/docs/Web/HTML/Element/section */}
      {/* TODO: 非推奨なのであとで修正 */}
      <section>
        <div dangerouslySetInnerHTML={{
          __html: content.contentText
        }} />
      </section>
    </article>
  )
};

export default Post;
