<template>
  <div class="flex h-screen flex-col items-center justify-center p-4">
    <UTabs
      v-if="!studying"
      :items="items"
      class="w-full md:w-2/3 2xl:w-1/2"
    >
      <template #default="{ item, selected }">
        <span
          class="truncate"
          :class="[selected && 'text-primary-500 dark:text-primary-400']"
        >
          {{ item.label }}
        </span>
      </template>
      <template #item="{ item }">
        <div v-if="item.label === 'Pomodoro'">
          <div class="flex flex-col items-center justify-center space-y-4 p-4 md:flex-row md:space-x-4 md:space-y-0">
            <UInput
              v-model="pomodoroStudyTime"
              icon="i-heroicons-pencil"
              placeholder="Study Time"
              type="number"
              size="lg"
              required
            />
            <UInput
              v-model="pomodoroBreakTime"
              icon="i-heroicons-hand-raised"
              placeholder="Break Time"
              type="number"
              size="lg"
              required
            />
            <UInput
              v-model="pomodoroRepititions"
              icon="i-heroicons-arrow-path"
              placeholder="Repititions"
              type="number"
              size="lg"
              required
            />
            <UInput
              v-model="className"
              icon="i-heroicons-user-group"
              placeholder="Class Name"
              size="lg"
              required
            />
            <UButton
              size="lg"
              @click="startPomodoro"
            >
              Start Studying
            </UButton>
          </div>
        </div>
        <div v-else-if="item.label === 'Countdown'">
          <div class="flex flex-col items-center justify-center space-y-4 p-4 md:flex-row md:space-x-4 md:space-y-0">
            <UInput
              v-model="countdownTime"
              icon="i-heroicons-clock"
              placeholder="Study Time"
              type="number"
              size="lg"
              required
            />
            <UInput
              v-model="className"
              icon="i-heroicons-user-group"
              placeholder="Class Name"
              size="lg"
              required
            />
            <UButton
              size="lg"
              @click="startCountdown"
            >
              Start Studying
            </UButton>
          </div>
        </div>
        <div v-else-if="item.label === 'Stats'">
          <div class="flex flex-col items-center p-4">
            <div class="flex flex-row space-x-4">
              <p class="w-48">
                Pomodoro Study Time:
              </p>
              <p class="w-32 text-right">
                {{ formatTime(totalPomodoroTime) }}
              </p>
            </div>
            <div class="flex flex-row space-x-4">
              <p class="w-48">
                Countdown Study Time:
              </p>
              <p class="w-32 text-right">
                {{ formatTime(totalCountdownTime) }}
              </p>
            </div>
            <UDivider class="my-2 w-96" />
            <div class="flex flex-row space-x-4">
              <p class="w-48">
                Total Study Time:
              </p>
              <p class="w-32 text-right">
                {{ formatTime(totalPomodoroTime + totalCountdownTime) }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
    <div
      v-else
      class="flex flex-col items-center justify-center space-y-4 text-center"
    >
      <div
        v-if="pomodoro"
        class="text-4xl font-bold"
      >
        <p v-if="onBreak">
          Break #{{ currentRepitition }}<span v-if="className !== ''"> - {{ className }}</span>
        </p>
        <p v-else>
          Study Session #{{ currentRepitition }}<span v-if="className !== ''"> - {{ className }}</span>
        </p>
      </div>
      <p
        v-else
        class="text-4xl font-bold"
      >
        Studying<span v-if="className !== ''"> - {{ className }}</span>
      </p>
      <p class="text-8xl font-bold">
        {{ formatTime(timeLeft) }}
      </p>
      <Transition>
        <UButton
          v-if="showStopButton || 768 > width"
          size="lg"
          @click="stopStudySession"
        >
          Stop Studying
        </UButton>
      </Transition>
    </div>
    <Transition>
      <ColorMode v-if="!studying" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { width } = useWindowSize();
const { x, y } = useMouse();

const className = ref('');
const countdownTime = ref(30);
const pomodoroStudyTime = ref(25);
const pomodoroBreakTime = ref(5);
const pomodoroRepititions = ref();
const currentRepitition = ref(0);
const pomodoro = ref(false);
const timeLeft = ref(0);
const studying = ref(false);
const onBreak = ref(false);
const showStopButton = ref(false);
const totalPomodoroTime = ref(0);
const totalCountdownTime = ref(0);
let doneSound: HTMLAudioElement;
let studyInterval: NodeJS.Timeout;
let breakInterval: NodeJS.Timeout;
let stopButtonInterval: NodeJS.Timeout;

function startPomodoro() {
  currentRepitition.value = 0;
  startPomodoroStudy();
}

function startPomodoroStudy() {
  pomodoro.value = true;
  studying.value = true;
  currentRepitition.value += 1;
  timeLeft.value = Math.round(pomodoroStudyTime.value * 60);
  studyInterval = setInterval(() => {
    timeLeft.value -= 1;
    totalPomodoroTime.value += 1;
    localStorage.setItem('totalPomodoroTime', totalPomodoroTime.value.toString());
    if (timeLeft.value <= 0) {
      clearInterval(studyInterval);
      doneSound.play();
      if (currentRepitition.value < pomodoroRepititions.value) {
        onBreak.value = true;
        startPomodoroBreak();
        return;
      }
      else {
        studying.value = false;
        onBreak.value = false;
        return;
      }
    }
  }, 1000);
}

function startPomodoroBreak() {
  timeLeft.value = Math.round(pomodoroBreakTime.value * 60);
  breakInterval = setInterval(() => {
    timeLeft.value -= 1;
    if (timeLeft.value <= 0) {
      doneSound.play();
      clearInterval(breakInterval);
      onBreak.value = false;
      startPomodoroStudy();
      return;
    }
  }, 1000);
}

function startCountdown() {
  pomodoro.value = false;
  studying.value = true;
  timeLeft.value = Math.round(countdownTime.value * 60);
  studyInterval = setInterval(() => {
    timeLeft.value -= 1;
    totalCountdownTime.value += 1;
    localStorage.setItem('totalCountdownTime', totalCountdownTime.value.toString());
    if (timeLeft.value <= 0) {
      doneSound.play();
      clearInterval(studyInterval);
      studying.value = false;
      return;
    }
  }, 1000);
}

function stopStudySession() {
  clearInterval(studyInterval);
  clearInterval(breakInterval);
  studying.value = false;
  pomodoro.value = false;
  onBreak.value = false;
  timeLeft.value = 0;
}

function formatTime(time: number) {
  const hours = Math.floor(time / 3600);
  const formattedHours = hours ? `${hours}h ` : '';
  const minutes = Math.floor((time % 3600) / 60);
  const formattedMinutes = minutes ? `${minutes}m ` : '';
  const seconds = time % 60;
  return `${formattedHours}${formattedMinutes}${seconds}s`;
}

watch([x, y], () => {
  showStopButton.value = true;
  clearTimeout(stopButtonInterval);
  stopButtonInterval = setTimeout(() => {
    showStopButton.value = false;
  }, 2000);
});

onMounted(() => {
  doneSound = new Audio('/ding.mp3');
  totalPomodoroTime.value = Number(localStorage.getItem('totalPomodoroTime')) || 0;
  totalCountdownTime.value = Number(localStorage.getItem('totalCountdownTime')) || 0;
});

onUnmounted(() => {
  localStorage.setItem('totalPomodoroTime', totalPomodoroTime.value.toString());
  localStorage.setItem('totalCountdownTime', totalCountdownTime.value.toString());
  clearInterval(studyInterval);
  clearInterval(breakInterval);
  clearInterval(stopButtonInterval);
});

const items = [
  {
    label: 'Pomodoro',
    icon: 'i-icon-park-outline:tomato',
  }, {
    label: 'Countdown',
    icon: 'i-heroicons-clock',
  }, {
    label: 'Stats',
    icon: 'i-heroicons-chart-bar',
  },
];

const title = computed(() => {
  if (studying.value) {
    if (pomodoro.value) {
      if (onBreak.value) {
        return `${formatTime(timeLeft.value)} - Break #${currentRepitition.value}`;
      }
      return `${formatTime(timeLeft.value)} - Study Session #${currentRepitition.value}`;
    }
    else {
      return `${formatTime(timeLeft.value)} - Studying`;
    }
  }
  return 'Study Timer';
});

useHead({
  titleTemplate: title,
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
