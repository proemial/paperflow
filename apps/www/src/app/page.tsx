import Image from "next/image";

export default function Home() {
  return (
    <main className="site-wrapper">
      <div className="content content--fixed">
        <header className="codrops-header">
          <div className="codrops-links">
            <a
              className="codrops-icon codrops-icon--prev"
              href="https://tympanus.net/Development/SlicedDualImageLayout/"
              title="Previous Demo"
            >
              <svg className="icon icon--arrow">
                <use xlink:href="#icon-arrow"></use>
              </svg>
            </a>
            <a
              className="codrops-icon codrops-icon--drop"
              href="https://tympanus.net/codrops/?p=32454"
              title="Back to the article"
            >
              <svg className="icon icon--drop">
                <use xlink:href="#icon-drop"></use>
              </svg>
            </a>
          </div>
          <h1 className="codrops-header__title">Liquid Distortion Effects</h1>
        </header>
        <a
          className="github"
          href="https://github.com/codrops/LiquidDistortion/"
          title="Find this project on GitHub"
        >
          <svg className="icon icon--github">
            <use xlink:href="#icon-github"></use>
          </svg>
        </a>
        <nav className="demos">
          <a className="demo demo--current" href="index.html">
            <span>Demo 1</span>
          </a>
          <a className="demo" href="index2.html">
            <span>Demo 2</span>
          </a>
          <a className="demo" href="index3.html">
            <span>Demo 3</span>
          </a>
          <a className="demo" href="index4.html">
            <span>Demo 4</span>
          </a>
          <a className="demo" href="index5.html">
            <span>Demo 5</span>
          </a>
        </nav>
        <a
          className="pater"
          href="http://synd.co/2yUIIuN"
          onClick="recordOutboundLink(this, 'Outbound Links', 'Hotjar10102017');return false;"
        >
          <div className="pater__img"></div>
          <h3 className="pater__title">
            ​Get feedback from your website visitors
          </h3>
          <p className="pater__description">
            Now you can get instant visual feedback from your website visitors.{" "}
            <strong>Learn more</strong>
          </p>
        </a>
      </div>
      <div className="content">
        <div className="slide-wrapper">
          <div className="slide-item">
            <img src="img/1.jpg" className="slide-item__image" alt="" />
          </div>
          <div className="slide-item">
            <img src="img/2.jpg" className="slide-item__image" alt="" />
          </div>
          <div className="slide-item">
            <img src="img/3.jpg" className="slide-item__image" alt="" />
          </div>
        </div>
        <button className="scene-nav scene-nav--prev" data-nav="previous">
          <svg className="icon icon--arrow-nav-prev">
            <use xlink:href="#icon-arrow-nav"></use>
          </svg>
        </button>
        <button className="scene-nav scene-nav--next" data-nav="next">
          <svg className="icon icon--arrow-nav-next">
            <use xlink:href="#icon-arrow-nav"></use>
          </svg>
        </button>
      </div>
    </main>
  );
}
