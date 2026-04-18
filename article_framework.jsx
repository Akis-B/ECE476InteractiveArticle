export default function ArticleFramework() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <article className="space-y-8">
          <header className="space-y-4 border-b border-neutral-200 pb-8">
            <p className="text-sm tracking-[0.18em] uppercase text-neutral-500">Feature Article</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Lorem Ipsum Dolor Sit Amet
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="text-sm text-neutral-500">
              <span>By Lorem Ipsum</span>
              <span className="mx-2">•</span>
              <span>April 18, 2026</span>
            </div>
          </header>

          <section className="space-y-6 text-[1.06rem] leading-8 text-neutral-800">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
              dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
              ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie,
              enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
              scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero
              pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio
              eu enim. Pellentesque sed dui ut augue blandit sodales.
            </p>

            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam nibh.
              Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
              Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar.
              Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus
              sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet
              pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet,
              consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula.
            </p>

            <blockquote className="border-l-4 border-black pl-5 text-2xl font-medium leading-10 text-black">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </blockquote>

            <p>
              Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus
              id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla non arcu
              lacinia neque faucibus fringilla. Nulla facilisi. Etiam neque. Sed ipsum. Donec quis nibh at felis
              congue commodo. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per inceptos himenaeos.
            </p>

            <h2 className="pt-4 text-2xl font-semibold leading-tight text-black">Lorem Ipsum Subheading</h2>

            <p>
              Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh.
              Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula
              vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac
              turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed,
              euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos.
            </p>

            <p>
              Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante
              quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat
              imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.
              Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa
              mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia curae.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
