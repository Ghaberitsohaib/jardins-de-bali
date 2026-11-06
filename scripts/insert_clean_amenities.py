with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 11. HORIZONTAL (VIEW FROM ABOVE PINNED PANORAMA WITH CLOUDS) -->"""

replacement = """                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 9. AMENITIES -->
        <section class="relative z-1 bg-[#1a2315]" id="Amenities">
          <div class="trigger relative flex min-h-screen w-full items-stretch overflow-clip">
            <img alt="Amenities" class="background absolute top-1/3 h-[calc(100%+20rem)] w-full -translate-y-1/2 object-cover max-md:object-[60%_50%]" loading="eager" src="/home/amenities/amenities-bg.webp" />
            <div class="wrapper relative z-1 flex items-stretch max-lg:flex-col-reverse max-md:flex-col">
              <div class="flex w-1/3 flex-col items-start justify-between py-30 max-lg:w-2/3 max-lg:flex-col-reverse max-lg:pt-0 max-lg:pb-15 max-md:w-3/4 max-md:pt-10 max-md:pb-5">
                <div class="videoWrap relative aspect-[1.43/1] w-full overflow-hidden rounded-[1.25rem]">
                  <video class="portrait lazy-video absolute -top-35 left-1/2 h-auto w-[200%] max-w-none -translate-x-1/2 object-cover" data-src="/home/amenities/amenities.mp4" preload="none" loop muted playsinline></video>
                </div>
                <p class="paragraph text-sand w-3/4 max-xl:w-full max-lg:mb-40 max-md:hidden" data-anim="paragraph">
                  BaytImmo is more than a residence. It features two private fitness spaces, two exclusive rooftop swimming pools and parks for residents and their guests, and three levels of secure parking. Curated spaces for wellness and serenity—a true sanctuary right at your doorstep.
                </p>
              </div>
              <div class="flex w-2/3 flex-col items-end justify-end gap-5 py-30 max-lg:items-start max-lg:pt-55 max-lg:pb-8 max-md:w-full max-md:flex-1 max-md:pt-0">
                <h2 class="hero text-cream-dark whitespace-nowrap uppercase max-xl:text-[8rem] max-lg:text-[6.5rem] max-md:text-[3rem]" data-anim="heading">Amenities</h2>
                <p class="paragraph text-sand mt-auto hidden w-3/4 pt-10 max-md:block">
                  BaytImmo is more than a residence. It features two private fitness spaces, two exclusive rooftop swimming pools and parks for residents and their guests, and three levels of secure parking. Curated spaces for wellness and serenity—a true sanctuary right at your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- 10. AMENITIES OPTIONS -->
        <section id="AmenitiesOptions">
          <div class="amenities-options-trigger trigger relative flex min-h-screen items-stretch py-20 max-xl:py-15 max-lg:flex-col">
            <div class="amenities-options-reveal-content wrapper relative flex items-end justify-between">
              <div class="flex h-full w-5/12 flex-col items-start justify-between gap-10 pr-20 max-xl:w-1/2 max-lg:w-full max-lg:pr-0">
                <div class="w-full">
                  <div class="list relative" id="amenOptionsList">
                    <div id="amenListIndicator" class="bg-pine-green pointer-events-none absolute top-0 -left-4 w-0.5 transition-all" style="height:0px;transform:translateY(0px);opacity:0"></div>
                    
                    <div class="amen-option-item is-active group relative cursor-pointer overflow-hidden" data-index="0">
                      <p class="amen-item-primary heading-2 text-golden group-hover:text-pine-green flex items-center py-2 leading-none transition-all duration-500 max-md:flex-col max-md:items-start max-md:py-4 max-md:pl-6">Rooftop</p>
                      <span class="amen-item-italic heading-2 text-pine-green flex items-center gap-6 py-4 italic transition-all duration-500 max-lg:pl-4 max-md:flex-col max-md:items-start max-md:justify-center max-md:gap-1 max-md:py-4 max-md:pl-6">
                        Rooftop
                      </span>
                    </div>
                    <div class="amen-option-item group relative cursor-pointer overflow-hidden" data-index="1">
                      <p class="amen-item-primary heading-2 text-golden group-hover:text-pine-green flex items-center py-2 leading-none transition-all duration-500 max-md:flex-col max-md:items-start max-md:py-4 max-md:pl-6">Private fitness space</p>
                      <span class="amen-item-italic heading-2 text-pine-green flex items-center gap-6 py-4 italic transition-all duration-500 max-lg:pl-4 max-md:flex-col max-md:items-start max-md:justify-center max-md:gap-1 max-md:py-4 max-md:pl-6">
                        Private fitness space
                      </span>
                    </div>
                    <div class="amen-option-item group relative cursor-pointer overflow-hidden" data-index="2">
                      <p class="amen-item-primary heading-2 text-golden group-hover:text-pine-green flex items-center py-2 leading-none transition-all duration-500 max-md:flex-col max-md:items-start max-md:py-4 max-md:pl-6">Garage</p>
                      <span class="amen-item-italic heading-2 text-pine-green flex items-center gap-6 py-4 italic transition-all duration-500 max-lg:pl-4 max-md:flex-col max-md:items-start max-md:justify-center max-md:gap-1 max-md:py-4 max-md:pl-6">
                        Garage
                      </span>
                    </div>
                  </div>
                </div>
                <div class="border-t-golden/40 relative min-h-35 w-full border-t pb-40">
                  <div class="amen-detail-panel absolute top-8 left-0 transition-opacity max-xl:top-10" data-index="0" style="opacity:1;pointer-events:auto;transition-duration:300ms">
                    <p class="kicker text-golden mb-4 uppercase">Rooftop</p>
                    <p class="paragraph max-w-xl">A place designed for an active and balanced lifestyle. A modernly equipped space that allows you to stay dedicated to yourself and your routines, with the comfort provided by life within the BaytImmo complex.</p>
                  </div>
                  <div class="amen-detail-panel absolute top-8 left-0 transition-opacity max-xl:top-10" data-index="1" style="opacity:0;pointer-events:none;transition-duration:300ms">
                    <p class="kicker text-golden mb-4 uppercase">Private fitness space</p>
                    <p class="paragraph max-w-xl">Your personal space for movement and balance. Designed in line with modern living, the in-house gym lets you stay focused on yourself, without leaving the complex and without distractions.</p>
                  </div>
                  <div class="amen-detail-panel absolute top-8 left-0 transition-opacity max-xl:top-10" data-index="2" style="opacity:0;pointer-events:none;transition-duration:300ms">
                    <p class="kicker text-golden mb-4 uppercase">Garage</p>
                    <p class="paragraph max-w-xl">Coming home begins without searching for a space. Spread across three underground levels, the garage offers security, privacy and everyday comfort, with your vehicle always within reach, protected and available at any moment, without leaving the complex.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="amenities-options-reveal-image reveal-image absolute top-0 right-0 h-full w-[55vw] max-xl:w-1/2 max-lg:relative max-lg:h-[60vh] max-lg:w-full">
              <div class="reveal-image-zoom relative h-full w-full">
                <div class="relative h-full w-full">
                  <div class="amen-image-pane absolute top-0 h-screen overflow-hidden transition-[width] duration-700 ease-in-out max-md:h-[calc(100%-21.5rem)] right-auto left-0 z-2 w-full" data-index="0" style="z-index:2">
                    <div class="amenities-parallaxWrap relative h-full w-full">
                      <div class="absolute top-0 left-1/2 h-full w-[55vw] -translate-x-1/2 max-xl:w-[50vw] max-lg:w-screen max-md:left-0 max-md:translate-x-0">
                        <div class="amenities-sliderWrap pointer-events-none h-full w-full -translate-y-[10%] scale-120 max-md:translate-y-0 max-md:scale-100">
                          <div class="relative h-full w-full overflow-hidden">
                            <img src="/home/amenities-options/rooftop.webp" alt="Rooftop" loading="eager" decoding="async" class="h-full w-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="amen-image-pane absolute top-0 h-screen overflow-hidden transition-[width] duration-700 ease-in-out max-md:h-[calc(100%-21.5rem)] pointer-events-none right-0 left-auto w-0 max-md:hidden" data-index="1" style="z-index:1">
                    <div class="amenities-parallaxWrap relative h-full w-full">
                      <div class="absolute top-0 left-1/2 h-full w-[55vw] -translate-x-1/2 max-xl:w-[50vw] max-lg:w-screen max-md:left-0 max-md:translate-x-0">
                        <div class="amenities-sliderWrap pointer-events-none h-full w-full -translate-y-[10%] scale-120 max-md:translate-y-0 max-md:scale-100">
                          <div class="relative h-full w-full overflow-hidden">
                            <img src="/home/amenities-options/fitness.webp" alt="Private fitness space" loading="eager" decoding="async" class="h-full w-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="amen-image-pane absolute top-0 h-screen overflow-hidden transition-[width] duration-700 ease-in-out max-md:h-[calc(100%-21.5rem)] pointer-events-none right-0 left-auto w-0 max-md:hidden" data-index="2" style="z-index:1">
                    <div class="amenities-parallaxWrap relative h-full w-full">
                      <div class="absolute top-0 left-1/2 h-full w-[55vw] -translate-x-1/2 max-xl:w-[50vw] max-lg:w-screen max-md:left-0 max-md:translate-x-0">
                        <div class="amenities-sliderWrap pointer-events-none h-full w-full -translate-y-[10%] scale-120 max-md:translate-y-0 max-md:scale-100">
                          <div class="relative h-full w-full overflow-hidden">
                            <img src="/home/amenities-options/parking.webp" alt="Garage" loading="eager" decoding="async" class="h-full w-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sand heading-1 absolute right-20 bottom-20 z-3 uppercase max-xl:hidden" data-anim="heading">Amenities</p>
            </div>
          </div>
        </section>

        <!-- 11. HORIZONTAL (VIEW FROM ABOVE PINNED PANORAMA WITH CLOUDS) -->"""

# Normalize CRLF/LF
target_crlf = target.replace('\r\n', '\n')
content_crlf = content.replace('\r\n', '\n')

if target_crlf in content_crlf:
    new_content = content_crlf.replace(target_crlf, replacement.replace('\r\n', '\n'), 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: index.html updated!")
else:
    print("ERROR: target not found in index.html")
