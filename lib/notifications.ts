import OneSignal from '@onesignal/node-onesignal';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!;
const ONESIGNAL_REST_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY!;

const configuration = OneSignal.createConfiguration({
  appKey: ONESIGNAL_REST_API_KEY,
});

const client = new OneSignal.DefaultApi(configuration);

export async function sendTaskNotification(userId: string, taskTitle: string, projectName: string) {
  try {
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;
    notification.include_external_user_ids = [userId];
    notification.contents = {
      en: `Tâche à faire : ${taskTitle} (${projectName})`,
    };
    notification.headings = {
      en: 'Rappel de tâche',
    };

    await client.createNotification(notification);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification :', error);
    throw error;
  }
}

export async function sendDeadlineNotification(userId: string, taskTitle: string, daysLeft: number) {
  try {
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;
    notification.include_external_user_ids = [userId];
    notification.contents = {
      en: `La tâche "${taskTitle}" arrive à échéance dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}.`,
    };
    notification.headings = {
      en: 'Deadline proche',
    };

    await client.createNotification(notification);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification :', error);
    throw error;
  }
}