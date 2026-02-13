<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2
          class="font-serif text-4xl sm:text-5xl font-light text-neutral-800 dark:text-neutral-100 mb-4"
        >
          {{ content.eventInfo.heading }}
        </h2>
        <div
          class="w-24 h-1 bg-gradient-to-r from-transparent via-neutral-400 to-transparent mx-auto"
        />
      </div>

      <!-- Main Info Card -->
      <UCard class="mb-12">
        <div class="space-y-8">
          <!-- Event Details -->
          <div class="grid md:grid-cols-2 gap-8 mb-0">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-calendar-days"
                  class="w-6 h-6 text-secondary mt-1 flex-shrink-0"
                />
                <div>
                  <h3 class="font-semibold text-lg mb-1 font-sans">
                    {{ content.eventInfo.when.title }}
                  </h3>
                  <p
                    class="text-neutral-600 dark:text-neutral-400"
                    v-html="content.eventInfo.when.mainText"
                  />
                  <p class="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                    {{ content.eventInfo.when.subText }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-map-pin"
                  class="w-6 h-6 text-secondary mt-1 flex-shrink-0"
                />
                <div>
                  <h3 class="font-semibold text-lg mb-1 font-sans">
                    {{ content.eventInfo.where.title }}
                  </h3>
                  <p
                    class="text-neutral-600 dark:text-neutral-400"
                    v-html="content.eventInfo.where.address"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-heart"
                  class="w-6 h-6 text-secondary mt-1 flex-shrink-0"
                />
                <div>
                  <h3 class="font-semibold text-lg mb-1 font-sans">
                    {{ content.eventInfo.celebration.title }}
                  </h3>
                  <p class="text-neutral-600 dark:text-neutral-400">
                    {{ content.eventInfo.celebration.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Icon
                  name="i-heroicons-user-group"
                  class="w-6 h-6 text-secondary mt-1 flex-shrink-0"
                />
                <div>
                  <h3 class="font-semibold text-lg mb-1 font-sans">
                    {{ content.eventInfo.guests.title }}
                  </h3>
                  <p class="text-neutral-600 dark:text-neutral-400">
                    {{ content.eventInfo.guests.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100[%] flex mt-4 md:mt-0 items-start gap-3">
            <Icon
              name="i-heroicons-home"
              class="w-6 h-6 text-secondary mt-1 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-lg mb-1 font-sans">
                {{ content.eventInfo.accomodation.title }}
              </h3>
              <p class="text-neutral-600 dark:text-neutral-400">
                {{ content.eventInfo.accomodation.description }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Schedule Preview -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <UCard>
          <div class="text-center">
            <div class="text-3xl font-serif mb-2">
              {{ content.eventInfo.schedule.friday.day }}
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {{ content.eventInfo.schedule.friday.date }}
            </div>
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ content.eventInfo.schedule.friday.description }}
            </p>
          </div>
        </UCard>

        <UCard class="ring-2 ring-secondary">
          <div class="text-center">
            <div class="text-3xl font-serif mb-2">
              {{ content.eventInfo.schedule.saturday.day }}
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {{ content.eventInfo.schedule.saturday.date }}
            </div>
            <p class="text-neutral-600 dark:text-neutral-400 font-semibold">
              {{ content.eventInfo.schedule.saturday.description }}
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-serif mb-2">
              {{ content.eventInfo.schedule.sunday.day }}
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {{ content.eventInfo.schedule.sunday.date }}
            </div>
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ content.eventInfo.schedule.sunday.description }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Additional Info -->
      <UAlert
        icon="i-heroicons-information-circle"
        variant="outline"
        :title="content.eventInfo.alert.title"
        :description="content.eventInfo.alert.description"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const content = useWeddingContent();
</script>

<style scoped>
.font-serif {
  font-family: "Cormorant Garamond", serif;
}

.font-sans {
  font-family: "Montserrat", sans-serif;
}
</style>
