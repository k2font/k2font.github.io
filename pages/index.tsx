import { NextPage, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { getAllContents } from "../utils/api";
import { css } from "goober"; // https://goober.js.org/api/css

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
      <div className={Background}></div>
      <div className={Main}>
        <h1>
          頭に叩き込んでいる技術を書くところ🐈
        </h1>
        <ul>
          {contents.map((content) => {
            return (
              <div key={content.slug}>
                <li>
                  {/* なぜLinkにはaタグが必要なのか */}
                  {/* https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag */}
                  <Link href={`/contents/${content.slug}`}>
                    <a><h2>{content.title}</h2></a>
                  </Link>
                  <p>公開日: {content.date}</p>
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
      </div>
    </>
  );
};

const Main = css`
  color: #222222;
  margin: 20px;

  body {
    background: rgb(var(--bg-color));
  }

  h1, h2 {
    font-family: 'Shippori Antique B1', sans-serif;
  };

  p {
    font-family: 'Noto Sans JP', sans-serif;
  }

  a {
    color: #f64f59;
    text-decoration: none;
  };

  a:hover {
    color: #FBD786;
    text-decoration: underline;
  }

  ul {
    list-style: none;
    padding: 0; // 中黒を取り除いた際に生じる空白を削除する
  }

  li {
    
  }
`;

const Background = css`
  position:absolute;
  top: 60%;
  left: 80%;

  aspect-ratio: 1 / 1;
  background: linear-gradient(45deg, #C6FFDD, #FBD786, #f64f59);
  border-radius: 50%;
  filter: blur(30px);
  width: min(100%, 400px);
`;

export default IndexPage;
