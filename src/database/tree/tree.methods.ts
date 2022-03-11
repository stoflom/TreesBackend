import { ITreeDocument } from './tree.types';

/*
export async function setLastUpdated(this: ITreeDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
//    await this.save();
    await this.updateOne(this, function (err)
      {
        if (err) console.error("ERROR: setLastUpdated failure: " + err + '\n')
      });
  }
}
*/
