//import { getUnpackedSettings } from 'http2';
import { IGenus, IGenusDocument } from './genus.types';

export async function findOneOrCreate(
  genus: IGenus
): Promise<IGenusDocument> {
  const record = await this.findOne(genus); //Find one returns the first match NB!
  if (record) {
    return record;
  } else {
    return this.create(genus);
  }
}

//Returns array
export async function findByGenusName(
  name: string
): Promise <IGenusDocument> {
  return this.findOne({ 'name': name }).select({   //If you use "find" you always get an array
    'name': 1,
    'authority': 1,
    'family': 1,
    'cnames': 1,
    'comments': 1,
    'hyperlinks': 1
  });
}



