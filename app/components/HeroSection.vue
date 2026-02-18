<template>
  <section
    class="relative min-h-screen flex items-start md:items-center bg-primary  bg-no-repeat bg-cover justify-center overflow-hidden"
     :style="{ backgroundImage: `url('${content.hero.backdrop}')`, backgroundPosition: 'right' }"
  >
    <!-- Background Video/Image -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-gradient-to-b from-amber/50 via-black/10 to-black/20 z-10"
      />
      <!-- You can replace this with a video element -->
      <div
        class="w-full h-full bg-bottom-left bg-no-repeat bg-fixed bg-contain"
        :style="{ backgroundImage: `url('${content.hero.backgroundImage}')` }"
      />
    </div>

    <!-- Content -->
    <div
      class="relative z-20 pt-20 md:mt-0 text-right px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto sm:ml-auto lg:mr-[4vw]"
    >
      <div class="space-y-8 animate-fade-in">
        <!-- Title -->
        <h1
          class="font-serif text-6xl text-center md:text-right md:text-9xl font-bold text-white tracking-wide mb-4 md:mb-10"
          v-html="content.hero.title"
        />
        <h2 class="subtitle relative w-full text-center md:text-right font-sans md:text-xl text-sm font-medium text-white/90">
          <span>{{ content.hero.subtitlePre }}</span>
          {{ content.hero.subtitle }}
        </h2>
        <!-- Countdown -->
        <div class="py-8">
          <div class="grid grid-cols-4 gap-4 sm:gap-8 max-w-2xl ml-auto">
            <div v-for="unit in timeUnits" :key="unit.label" class="countdown-unit">
              <div
                class="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-primary/20 text-center"
              >
                <div class="text-3xl sm:text-5xl font-light text-white font-serif">
                  {{ unit.value }}
                </div>
                <div
                  class="text-xs sm:text-sm text-white/80 uppercase tracking-wider mt-2 font-sans"
                >
                  {{ unit.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Location and Date -->
        <div
          class="pt-4 flex flex-col sm:flex-row-reverse gap-8 sm:gap-16 max-w-5xl ml-auto"
        >
          <!-- Location -->
          <div class="flex-1">
            <p
              class="text-lg sm:text-xl text-white/90 font-light flex flex-row-reverse items-center gap-2"
            >
              <Icon name="i-heroicons-map-pin" class="flex-shrink-0 w-7 h-7" />
              <span>{{ content.hero.location }}</span>
            </p>
          </div>
          <!-- Date -->
          <div class="flex-1">
            <p
              class="text-lg sm:text-xl text-white/90 font-light flex flex-row-reverse items-center gap-2"
            >
              <Icon name="i-heroicons-calendar" class="flex-shrink-0 w-7 h-7" />
              <span>{{ content.hero.date }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Scroll Indicator -->
    <div class="pt-12 animate-bounce absolute bottom-2 z-20">
      <Icon name="i-heroicons-chevron-down" class="w-8 h-8 text-white/60 mx-auto" />
    </div>
  </section>
</template>

<script setup lang="ts">
const { hero, event } = useWeddingContent();
const content = { hero, event };

const targetDate = new Date(event.dateISO);

const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const timeUnits = computed(() => [
  {
    label: hero.countdown.labels.days,
    value: String(timeRemaining.value.days).padStart(2, "0"),
  },
  {
    label: hero.countdown.labels.hours,
    value: String(timeRemaining.value.hours).padStart(2, "0"),
  },
  {
    label: hero.countdown.labels.minutes,
    value: String(timeRemaining.value.minutes).padStart(2, "0"),
  },
  {
    label: hero.countdown.labels.seconds,
    value: String(timeRemaining.value.seconds).padStart(2, "0"),
  },
]);

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance > 0) {
    timeRemaining.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  } else {
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

let interval: number | undefined = undefined;

onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1.5s ease-out;
}

.countdown-unit {
  transition: transform 0.3s ease;
}

.countdown-unit:hover {
  transform: scale(1.05);
}
</style>
