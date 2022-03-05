import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllContents } from "../utils/api";

export const getStaticProps = async () => {
  const contents = getAllContents(["slug", "title", "date", "tags"]);

  return {
    props: { contents },
  }
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ contents }) => {
  return (
    <>
      <h1>
        k2fontのブログ
      </h1>
      <ul>
        {contents.map((content) => {
          return (
            <div key={content.slug}>
              <li>
                <Link href={`/contents/${content.slug}`}>
                  <h2>{content.title}</h2>
                </Link>
                <p>{content.date}</p>
                <ul>
                  {content.tags.map((tag) => {
                    return <li key={tag}>{tag}</li>
                  })}
                </ul>
              </li>
            </div>
          );
        })}
      </ul>
    </>
  );
};

export default IndexPage;
