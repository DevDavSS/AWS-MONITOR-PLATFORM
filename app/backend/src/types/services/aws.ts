export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;   /*Neceario para guardar credenciales en caché y no realizar varias peticiones cada que se utilice el dashboard */
}