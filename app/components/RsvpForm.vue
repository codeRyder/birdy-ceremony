<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-50">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-serif text-4xl sm:text-5xl font-light text-neutral-900 dark:text-neutral-900 mb-4">
          {{ content.rsvp.heading }}
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400">
          {{ content.rsvp.subheading }}
        </p>
        <div class="w-24 h-1 bg-gradient-to-r from-transparent via-neutral-400 to-transparent mx-auto mt-4" />
      </div>

      <!-- Form -->
      <UCard class="bg-neutral-50" >
        <UForm :state="formState" class="space-y-6" netlify>
          <!-- Name -->
          <UFormField :label="content.rsvp.form.name.label"  size="xl" name="name" required>
            <UInput
              v-model="formState.name"
              :placeholder="content.rsvp.form.name.placeholder"
              size="xl"
              :disabled="submitting"
              :ui=" { root: 'w-full' }"              
            />
          </UFormField>

          <!-- Email -->
          <UFormField :label="content.rsvp.form.email.label" size="xl" name="email"   required>
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="content.rsvp.form.email.placeholder"
              size="xl"
              :disabled="submitting"
              :ui=" { root: 'w-full' }"
            />
          </UFormField>

          <!-- Attendance -->
          <UFormField :label="content.rsvp.form.attendance.label" name="attendance" size="xl" required>
            <URadioGroup
              v-model="formState.attendance"
              :items="content.rsvp.form.attendance.options"
              :disabled="submitting"
            />
          </UFormField>

          <!-- Conditional: Additional People -->
          <div v-if="formState.attendance === 'attending'" class="space-y-6 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <UFormField 
              :label="content.rsvp.form.additionalPeople.label" 
              name="additionalPeople"
              :description="content.rsvp.form.additionalPeople.help"
              size="xl"
            >
              <UInput
                v-model.number="formState.additionalPeople"
                type="number"
                :min="content.rsvp.form.additionalPeople.min"
                :max="content.rsvp.form.additionalPeople.max"
                size="xl"
                :disabled="submitting"
              />
            </UFormField>

            <!-- Guest Names if additional people -->
            <UFormField
              v-if="formState.additionalPeople > 0"
              :label="content.rsvp.form.guestNames.label"
              name="guestNames"
              :help="content.rsvp.form.guestNames.help"
            >
              <div class="grid gap-4 sm:grid-cols-2">
                <UInput
                  v-for="slot in formState.additionalPeople"
                  :key="`guest-${slot}`"
                  v-model="formState.guestNames[slot - 1]"
                  size="xl"
                  :placeholder="`${content.rsvp.form.guestNames.placeholder} ${slot}`"
                  :disabled="slot > formState.additionalPeople || submitting"
                />
              </div>
            </UFormField>
          </div>

          <!-- Stay Tuned -->
          <UFormField name="stayTuned">
            <UCheckbox
              v-model="formState.stayTuned"
              :label="content.rsvp.form.stayTuned.label"
              :disabled="submitting"
              size="xl"
            />
          </UFormField>

          <!-- Honeypot (spam protection) -->
          <div class="hidden">
            <input
              v-model="formState.honeypot"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col items-center gap-4 pt-4">
            <UButton
              type="submit"
              size="xl"
              :loading="submitting"
              :disabled="!isFormValid || submitting"
              class="w-full sm:w-auto justify-center"
            >
              {{ submitting ? content.rsvp.form.submit.submitting : content.rsvp.form.submit.default }}
            </UButton>

            <!-- Success Message -->
            <UAlert
              v-if="submitted"
              icon="i-heroicons-check-circle"
              color="success"
              variant="subtle"
              :title="content.rsvp.form.messages.success.title"
              :description="content.rsvp.form.messages.success.description"
              class="w-full"
            />

            <!-- Error Message -->
            <UAlert
              v-if="error"
              icon="i-heroicons-exclamation-circle"
              color="error"
              variant="subtle"
              :title="content.rsvp.form.messages.error.title"
              :description="error"
              class="w-full"
            />
          </div>
        </UForm>
      </UCard>

      <!-- Calendar Download -->
      <div class="mt-12 text-center">
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          {{ content.rsvp.calendar.text }}
        </p>
        <CalendarDownload />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const content = useWeddingContent()

const MAX_ADDITIONAL_GUESTS = 4
const createEmptyGuestList = () => Array.from({ length: MAX_ADDITIONAL_GUESTS }, () => '')

interface FormState {
  name: string
  email: string
  attendance: 'attending' | 'not-attending' | 'dont-know' | ''
  additionalPeople: number
  guestNames: string[]
  stayTuned: boolean
  honeypot: string
}

const formState = reactive<FormState>({
  name: '',
  email: '',
  attendance: '',
  additionalPeople: 0,
  guestNames: createEmptyGuestList(),
  stayTuned: false,
  honeypot: ''
})

const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return formState.name.trim() !== '' &&
         formState.email.trim() !== '' &&
         formState.attendance !== '' &&
         formState.additionalPeople >= 0 &&
         formState.additionalPeople <= 4
})

// const handleSubmit = async () => {
//   // Spam protection check
//   if (formState.honeypot) {
//     console.log('Spam detected')
//     return
//   }

//   submitting.value = true
//   error.value = ''
//   submitted.value = false

//   try {
//     const submissionData = {
//       name: formState.name.trim(),
//       email: formState.email.trim(),
//       attendance: formState.attendance,
//       additionalPeople: formState.additionalPeople,
//       guestNames: formState.guestNames
//         .slice(0, formState.additionalPeople)
//         .map(name => name.trim())
//         .filter(Boolean),
//       stayTuned: formState.stayTuned
//     }

//     //Create formdata from submissionData
//     const formData = new FormData();
//     Object.entries(submissionData).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         value.forEach((item, index) => {
//           formData.append(`${key}[${index}]`, item);
//         });
//       } else {
//         formData.append(key, String(value));
//       }
//     });

//     await $fetch('/', {
//       method: 'POST',
//       body: new URLSearchParams(formData).toString()
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     })

//     submitted.value = true
    
//     // Reset form after successful submission
//     setTimeout(() => {
//       formState.name = ''
//       formState.email = ''
//       formState.attendance = ''
//       formState.additionalPeople = 0
//       formState.guestNames = createEmptyGuestList()
//       formState.stayTuned = false
//     }, 3000)
//   } catch (err: any) {
//     const serverMessage = err?.data?.statusMessage || err?.statusMessage
//     error.value = serverMessage || err?.message || content.rsvp.form.messages.error.defaultDescription
//     console.error('Form submission error:', err)
//   } finally {
//     submitting.value = false
//   }
// }

// Reset additional people when attendance changes
watch(() => formState.attendance, (newValue) => {
  if (newValue !== 'attending') {
    formState.additionalPeople = 0
    formState.guestNames = createEmptyGuestList()
  }
})

watch(() => formState.additionalPeople, (count) => {
  for (let i = count; i < MAX_ADDITIONAL_GUESTS; i += 1) {
    formState.guestNames[i] = ''
  }
})
</script>

<style scoped>
.font-serif {
  font-family: 'Cormorant Garamond', serif;
}

.font-sans {
  font-family: 'Montserrat', sans-serif;
}
button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
</style>
